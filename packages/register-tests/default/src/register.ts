declare module 'abitype' {
  interface Register {
    AddressType: `0x${string}` & { _tag: 'AddressType' }
  }
}
