import { NextResponse } from 'next/server';

export function getErrorMessage(error: unknown) {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return 'An error occurred';
}

export function apiResponse<T>(json: T, status?: number) {
  return NextResponse.json(json, status ? { status } : undefined);
}
