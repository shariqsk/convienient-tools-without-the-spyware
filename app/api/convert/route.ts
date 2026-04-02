import { NextRequest, NextResponse } from "next/server";
import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import { PassThrough } from "stream";

// Point fluent-ffmpeg at the bundled static binary
if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

export async function POST(req: NextRequest) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { url } = body;
  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  if (!ytdl.validateURL(url)) {
    return NextResponse.json({ error: "Invalid or unsupported URL" }, { status: 400 });
  }

  let info: ytdl.videoInfo;
  try {
    info = await ytdl.getInfo(url);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch video info";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const safeTitle = info.videoDetails.title
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 100);

  const fileName = `${safeTitle}.mp3`;

  // Stream audio from YouTube
  const audioStream = ytdl(url, {
    quality: "highestaudio",
    filter: "audioonly",
  });

  // Pipe through ffmpeg → MP3 → PassThrough
  const passThrough = new PassThrough();

  ffmpeg(audioStream)
    .audioCodec("libmp3lame")
    .audioBitrate(192)
    .format("mp3")
    .on("error", (err) => {
      console.error("ffmpeg error:", err.message);
      passThrough.destroy(err);
    })
    .pipe(passThrough, { end: true });

  // Convert Node stream to Web ReadableStream
  const readable = new ReadableStream({
    start(controller) {
      passThrough.on("data", (chunk: Buffer) => controller.enqueue(chunk));
      passThrough.on("end", () => controller.close());
      passThrough.on("error", (err) => controller.error(err));
    },
    cancel() {
      passThrough.destroy();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Transfer-Encoding": "chunked",
    },
  });
}
