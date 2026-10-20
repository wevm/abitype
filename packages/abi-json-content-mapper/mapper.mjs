// Experimental TypeScript 7.1 content mapper. Stdout is reserved for JSON-RPC.
let buffer = Buffer.alloc(0)

function transform(content) {
  try {
    if (!Array.isArray(JSON.parse(content)))
      throw new Error(
        'Expected a JSON ABI array, not a contract artifact object.',
      )
  } catch (error) {
    return {
      text: 'export default [] as const;\n',
      extension: '.ts',
      mappings: [],
      diagnostics: [
        {
          start: 0,
          length: content.length,
          code: 1,
          messageText: error.message,
        },
      ],
    }
  }

  const prefix = 'const abi = ('
  return {
    text: `${prefix}${content}) as const;\nexport default abi;\n`,
    extension: '.ts',
    // Verbatim mapping in UTF-16 code units. Only the wrapper is synthesized.
    mappings: [[prefix.length, content.length, 0, content.length, 0]],
  }
}

function handle(request) {
  switch (request.method) {
    case 'initialize':
      if (!request.params.positionEncodings.includes('utf-16'))
        throw new Error('This mapper requires UTF-16 positions.')
      return { positionEncoding: 'utf-16', diagnosticSource: 'abi-json' }
    case 'openProject':
      return {}
    case 'transform':
      return transform(request.params.content)
    case 'closeProject':
      return null
    default:
      throw new Error(`Unknown content mapper method: ${request.method}`)
  }
}

function respond(payload) {
  let request
  let response
  try {
    request = JSON.parse(payload.toString('utf8'))
    response = { jsonrpc: '2.0', id: request.id, result: handle(request) }
  } catch (error) {
    response = {
      jsonrpc: '2.0',
      id: request?.id ?? null,
      error: { code: -32603, message: error.message },
    }
  }
  const body = Buffer.from(JSON.stringify(response), 'utf8')
  process.stdout.write(`Content-Length: ${body.length}\r\n\r\n`)
  process.stdout.write(body)
}

process.stdin.on('data', (chunk) => {
  buffer = Buffer.concat([buffer, chunk])
  while (true) {
    const headerEnd = buffer.indexOf('\r\n\r\n')
    if (headerEnd === -1) return
    const header = buffer.subarray(0, headerEnd).toString('ascii')
    const match = /^Content-Length:\s*(\d+)\s*$/im.exec(header)
    if (!match) throw new Error('Missing Content-Length header.')
    const length = Number(match[1])
    const start = headerEnd + 4
    if (buffer.length < start + length) return
    const payload = buffer.subarray(start, start + length)
    buffer = buffer.subarray(start + length)
    respond(payload)
  }
})
