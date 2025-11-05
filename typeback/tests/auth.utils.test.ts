// @ts-nocheck
import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword, signToken } from '../utils/auth.js'
import jwt from 'jsonwebtoken'

describe('auth utils', () => {
  it('hashes and verifies password', async () => {
    const hash = await hashPassword('secret123')
    expect(hash).toBeTypeOf('string')
    const ok = await verifyPassword('secret123', hash)
    expect(ok).toBe(true)
  })

  it('signs a JWT with default secret', async () => {
    const token = signToken({ sub: 'user-1' })
    const decoded = jwt.decode(token)
    expect(decoded).toMatchObject({ sub: 'user-1' })
  })
})


