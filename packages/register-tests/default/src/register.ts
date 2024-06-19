declare module 'abitype' {
  interface Register {
    addressType: `0x${string}` & { _tag: 'addressType' }
  }
}
