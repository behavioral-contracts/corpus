/**
 * groq-sdk Ground-Truth Fixture
 *
 * Each call site is annotated // SHOULD_FIRE or // SHOULD_NOT_FIRE.
 * Derived from the groq-sdk contract spec, NOT V1 behavior.
 *
 * Contracted functions (all namespaced `create` from import "groq-sdk"):
 *   - groq.chat.completions.create()     postcondition: api-error
 *   - groq.audio.transcriptions.create() postcondition: api-error
 *   - groq.audio.translations.create()   postcondition: api-error
 *   - groq.audio.speech.create()         postcondition: api-error
 *   - groq.embeddings.create()           postcondition: api-error
 *
 * groq-sdk uses deep property chains (3+ levels), detected by PropertyChainDetector.
 * Pattern is structurally identical to openai SDK.
 */

import Groq from 'groq-sdk';
import * as fs from 'fs';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'test-key' });

// ─────────────────────────────────────────────────────────────────────────────
// 1. chat.completions.create — the core use case
// ─────────────────────────────────────────────────────────────────────────────

export async function chatNoCatch() {
  // SHOULD_FIRE: api-error — chat.completions.create throws on API failure, no try-catch
  const completion = await groq.chat.completions.create({
    model: 'llama3-8b-8192',
    messages: [{ role: 'user', content: 'Hello!' }],
  });
  return completion.choices[0].message.content;
}

export async function chatWithCatch() {
  try {
    // SHOULD_NOT_FIRE: create inside try-catch satisfies error handling
    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: 'Hello!' }],
    });
    return completion.choices[0].message.content;
  } catch (err) {
    if (err instanceof Groq.RateLimitError) {
      throw new Error('Rate limited');
    }
    throw err;
  }
}

export async function chatStreamNoCatch() {
  // SHOULD_FIRE: api-error — streaming create still throws, no try-catch
  const stream = await groq.chat.completions.create({
    model: 'llama3-8b-8192',
    messages: [{ role: 'user', content: 'Tell me a story' }],
    stream: true,
  });
  let result = '';
  for await (const chunk of stream) {
    result += chunk.choices[0]?.delta?.content ?? '';
  }
  return result;
}

export async function chatStreamWithCatch() {
  try {
    // SHOULD_NOT_FIRE: streaming create inside try-catch is safe
    const stream = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: 'Tell me a story' }],
      stream: true,
    });
    let result = '';
    for await (const chunk of stream) {
      result += chunk.choices[0]?.delta?.content ?? '';
    }
    return result;
  } catch (err) {
    console.error('Stream error:', err);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. audio.transcriptions.create
// ─────────────────────────────────────────────────────────────────────────────

export async function transcriptionNoCatch(filePath: string) {
  // SHOULD_FIRE: api-error — transcriptions.create throws on bad file or network error, no try-catch
  const transcription = await groq.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: 'whisper-large-v3',
  });
  return transcription.text;
}

export async function transcriptionWithCatch(filePath: string) {
  try {
    // SHOULD_NOT_FIRE: transcriptions.create inside try-catch
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-large-v3',
    });
    return transcription.text;
  } catch (err) {
    console.error('Transcription failed:', err);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. audio.translations.create
// ─────────────────────────────────────────────────────────────────────────────

export async function translationNoCatch(filePath: string) {
  // SHOULD_FIRE: api-error — translations.create throws, no try-catch
  const translation = await groq.audio.translations.create({
    file: fs.createReadStream(filePath),
    model: 'whisper-large-v3',
  });
  return translation.text;
}

export async function translationWithCatch(filePath: string) {
  try {
    // SHOULD_NOT_FIRE: translations.create inside try-catch
    const translation = await groq.audio.translations.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-large-v3',
    });
    return translation.text;
  } catch (err) {
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. audio.speech.create
// ─────────────────────────────────────────────────────────────────────────────

export async function speechNoCatch(text: string) {
  // SHOULD_FIRE: api-error — speech.create throws on TTS failure, no try-catch
  const speech = await groq.audio.speech.create({
    model: 'playai-tts',
    voice: 'Fritz-PlayAI',
    input: text,
  });
  return speech;
}

export async function speechWithCatch(text: string) {
  try {
    // SHOULD_NOT_FIRE: speech.create inside try-catch
    const speech = await groq.audio.speech.create({
      model: 'playai-tts',
      voice: 'Fritz-PlayAI',
      input: text,
    });
    return speech;
  } catch (err) {
    if (err instanceof Groq.APIError) {
      console.error('TTS failed:', err.status, err.message);
    }
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. embeddings.create
// ─────────────────────────────────────────────────────────────────────────────

export async function embeddingNoCatch(text: string) {
  // SHOULD_FIRE: api-error — embeddings.create throws on rate limit or network error, no try-catch
  const response = await groq.embeddings.create({
    model: 'nomic-embed-text-v1_5',
    input: text,
  });
  return response.data[0].embedding;
}

export async function embeddingWithCatch(text: string) {
  try {
    // SHOULD_NOT_FIRE: embeddings.create inside try-catch
    const response = await groq.embeddings.create({
      model: 'nomic-embed-text-v1_5',
      input: text,
    });
    return response.data[0].embedding;
  } catch (err) {
    if (err instanceof Groq.RateLimitError) {
      throw new Error('Embedding rate limited');
    }
    throw err;
  }
}
