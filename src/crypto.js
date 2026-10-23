// Szyfrowanie end-to-end: klucz pary istnieje tylko na dwóch telefonach.
// Serwer dostaje wyłącznie nonce + zaszyfrowany box (XSalsa20-Poly1305, tweetnacl).
import nacl from 'tweetnacl';
import { getRandomBytes } from 'expo-crypto';

nacl.setPRNG((x, n) => {
  const b = getRandomBytes(n);
  for (let i = 0; i < n; i++) x[i] = b[i];
});

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function toB64(bytes) {
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i], b = bytes[i + 1], c = bytes[i + 2];
    out += B64[a >> 2] + B64[((a & 3) << 4) | ((b ?? 0) >> 4)];
    out += b === undefined ? '=' : B64[((b & 15) << 2) | ((c ?? 0) >> 6)];
    out += c === undefined ? '=' : B64[c & 63];
  }
  return out;
}

export function fromB64(str) {
  const clean = str.replace(/[^A-Za-z0-9+/]/g, '');
  const out = new Uint8Array(Math.floor((clean.length * 3) / 4));
  let o = 0;
  for (let i = 0; i < clean.length; i += 4) {
    const n = [0, 1, 2, 3].map((k) => (i + k < clean.length ? B64.indexOf(clean[i + k]) : 0));
    const v = (n[0] << 18) | (n[1] << 12) | (n[2] << 6) | n[3];
    if (o < out.length) out[o++] = (v >> 16) & 255;
    if (o < out.length) out[o++] = (v >> 8) & 255;
    if (o < out.length) out[o++] = v & 255;
  }
  return out;
}

function utf8(str) {
  const out = [];
  for (const ch of str) {
    let c = ch.codePointAt(0);
    if (c < 0x80) out.push(c);
    else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
    else if (c < 0x10000) out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    else out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
  }
  return new Uint8Array(out);
}

function fromUtf8(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; ) {
    const b = bytes[i];
    let c, n;
    if (b < 0x80) { c = b; n = 1; }
    else if (b < 0xe0) { c = ((b & 31) << 6) | (bytes[i + 1] & 63); n = 2; }
    else if (b < 0xf0) { c = ((b & 15) << 12) | ((bytes[i + 1] & 63) << 6) | (bytes[i + 2] & 63); n = 3; }
    else { c = ((b & 7) << 18) | ((bytes[i + 1] & 63) << 12) | ((bytes[i + 2] & 63) << 6) | (bytes[i + 3] & 63); n = 4; }
    s += String.fromCodePoint(c);
    i += n;
  }
  return s;
}

export const newKey = () => toB64(nacl.randomBytes(nacl.secretbox.keyLength));

export function seal(obj, keyB64) {
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  const box = nacl.secretbox(utf8(JSON.stringify(obj)), nonce, fromB64(keyB64));
  return { nonce: toB64(nonce), box: toB64(box) };
}

export function open(nonceB64, boxB64, keyB64) {
  const plain = nacl.secretbox.open(fromB64(boxB64), fromB64(nonceB64), fromB64(keyB64));
  if (!plain) return null; // zły klucz albo uszkodzony wpis
  try { return JSON.parse(fromUtf8(plain)); } catch { return null; }
}
