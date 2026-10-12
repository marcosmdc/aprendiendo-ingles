"""Genera con Piper los audios de cada verbo (base, past, participle) en velocidad normal y lenta.

Uso (desde la raiz del proyecto):
    python -m venv .piper/venv
    .piper/venv/Scripts/python -m pip install piper-tts
    .piper/venv/Scripts/python -m piper.download_voices --data-dir .piper/voices en_US-lessac-medium
    .piper/venv/Scripts/python scripts/generate_audio.py

Necesita ffmpeg en el PATH para convertir a mp3.
"""

import io
import json
import re
import subprocess
import sys
import wave
from pathlib import Path

from piper import PiperVoice, SynthesisConfig

ROOT = Path(__file__).resolve().parent.parent
VOICE = ROOT / ".piper" / "voices" / "en_US-lessac-medium.onnx"
OUT = ROOT / "public" / "audio" / "verbs"

SPEEDS = {
    "": (SynthesisConfig(length_scale=1.0), 0.45),
    "-slow": (SynthesisConfig(length_scale=1.5), 0.8),
}


def load_verbs():
    source = (ROOT / "app" / "data.ts").read_text(encoding="utf-8")
    pattern = r'base: "([^"]+)", past: "([^"]+)", participle: "([^"]+)"'
    return re.findall(pattern, source)


def synthesize(voice, text, config):
    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as wav_file:
        voice.synthesize_wav(text, wav_file, syn_config=config)
    buffer.seek(0)
    with wave.open(buffer, "rb") as wav_file:
        return wav_file.getparams(), wav_file.readframes(wav_file.getnframes())


def build_clip(voice, forms, config, pause):
    params, frames = None, b""
    for index, form in enumerate(forms):
        # "was/were" se lee como "was or were".
        params, audio = synthesize(voice, form.replace("/", " or "), config)
        if index:
            frames += b"\x00" * int(params.framerate * pause) * params.sampwidth
        frames += audio
    return params, frames


def to_mp3(params, frames, target):
    wav_bytes = io.BytesIO()
    with wave.open(wav_bytes, "wb") as wav_file:
        wav_file.setparams(params)
        wav_file.writeframes(frames)
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", "pipe:0", "-ac", "1", "-b:a", "64k", str(target)],
        input=wav_bytes.getvalue(),
        check=True,
    )


def main():
    if not VOICE.exists():
        sys.exit(f"Falta la voz: {VOICE}")
    voice = PiperVoice.load(str(VOICE))
    OUT.mkdir(parents=True, exist_ok=True)
    verbs = load_verbs()
    for base, past, participle in verbs:
        for suffix, (config, pause) in SPEEDS.items():
            params, frames = build_clip(voice, [base, past, participle], config, pause)
            to_mp3(params, frames, OUT / f"{base}{suffix}.mp3")
        print(f"ok {base}")
    # Lista que usa el service worker para guardar todos los audios y funcionar sin conexion.
    files = sorted(f"/audio/verbs/{path.name}" for path in OUT.glob("*.mp3"))
    (OUT / "index.json").write_text(json.dumps(files, indent=0), encoding="utf-8")
    print(f"{len(verbs)} verbos generados en {OUT}")


if __name__ == "__main__":
    main()
