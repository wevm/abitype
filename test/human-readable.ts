export const nestedTupleArrayHumanReadableAbi = [
  'function f((uint8 a, uint8[] b, (uint8 x, uint8 y)[] c) s, (uint x, uint y) t, uint256 a) returns ((uint256 x, uint256 y)[] t)',
  'function v((uint8 a, uint8[] b) s, (uint x, uint y) t, uint256 a)',
] as const

/**
 * WagmiMintExample
 * https://etherscan.io/address/0xaf0326d92b97df1221759476b072abfd8084f9be
 */
export const wagmiMintExampleHumanReadableAbi = [
  'constructor()',
  'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
  'event ApprovalForAll(address indexed owner, address indexed operator, bool approved)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  'function approve(address to, uint256 tokenId)',
  'function balanceOf(address owner) view returns (uint256)',
  'function getApproved(uint256 tokenId) view returns (address)',
  'function isApprovedForAll(address owner, address operator) view returns (bool)',
  'function mint()',
  'function name() view returns (string)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function safeTransferFrom(address from, address to, uint256 tokenId)',
  'function safeTransferFrom(address from, address to, uint256 tokenId, bytes _data)',
  'function setApprovalForAll(address operator, bool approved)',
  'function supportsInterface(bytes4 interfaceId) view returns (bool)',
  'function symbol() view returns (string)',
  'function tokenURI(uint256 tokenId) pure returns (string)',
  'function totalSupply() view returns (uint256)',
  'function transferFrom(address from, address to, uint256 tokenId)',
] as const
