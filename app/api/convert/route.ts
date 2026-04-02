import { NextRequest, NextResponse } from "next/server";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import { spawn } from "child_process";
import { PassThrough } from "stream";

if (ffmpegStatic) ffmpeg.setFfmpegPath(ffmpegStatic);

const YTDLP = "yt-dlp";

function isYouTube(url: string) {
  return /youtu\.?be/.test(url);
}

function runYtDlp(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(YTDLP, args);
    let out = "";
    let err = "";
    proc.stdout.on("data", (d: Buffer) => (out += d.toString()));
    proc.stderr.on("data", (d: Buffer) => (err += d.toString()));
    proc.on("close", (code) => {
      if (code === 0) resolve(out.trim());
      else reject(new Error(err.split("\n").filter(l => !l.startsWith("WARNING")).join(" ").trim() || "yt-dlp failed"));
    });
  });
}

function streamToMp3(inputUrl: string, fileName: string): Response {
  const passThrough = new PassThrough();

  ffmpeg(inputUrl)
    .noVideo()
    .audioCodec("libmp3lame")
    .audioBitrate(192)
    .format("mp3")
    .inputOptions(["-user_agent", "Mozilla/5.0"])
    .on("error", (err) => {
      console.error("ffmpeg:", err.message);
      passThrough.destroy(err);
    })
    .pipe(passThrough, { end: true });

  const readable = new ReadableStream<Uint8Array>({
    start(controller) {
      passThrough.on("data", (chunk: Buffer) => controller.enqueue(chunk));
      passThrough.on("end", () => controller.close());
      passThrough.on("error", (err) => controller.error(err));
    },
    cancel() { passThrough.destroy(); },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}

export async function POST(req: NextRequest) {
  let body: { url?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }

  const { url } = body;
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  try { new URL(url); } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (isYouTube(url)) {
    // Use yt-dlp to resolve the real audio stream URL
    let streamUrl: string;
    let title: string;
    try {
      [streamUrl, title] = await Promise.all([
        runYtDlp(["--get-url", "-f", "bestaudio", "--no-playlist", url]),
        runYtDlp(["--get-title", "--no-playlist", url]),
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to extract stream";
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    const safeTitle = title.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_").slice(0, 100);
    return streamToMp3(streamUrl, `${safeTitle}.mp3`);
  }

  // Any direct video/audio URL — ffmpeg downloads and converts directly
  const name = url.split("/").pop()?.split("?")[0]?.replace(/\.\w+$/, "") ?? "audio";
  return streamToMp3(url, `${name}.mp3`);
}
