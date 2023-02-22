export const nestedTupleArrayAbi = [
  {
    name: 'f',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      {
        name: 's',
        type: 'tuple',
        components: [
          {
            name: 'a',
            type: 'uint8',
          },
          {
            name: 'b',
            type: 'uint8[]',
          },
          {
            name: 'c',
            type: 'tuple[]',
            components: [
              {
                name: 'x',
                type: 'uint8',
              },
              {
                name: 'y',
                type: 'uint8',
              },
            ],
          },
        ],
      },
      {
        name: 't',
        type: 'tuple',
        components: [
          {
            name: 'x',
            type: 'uint',
          },
          {
            name: 'y',
            type: 'uint',
          },
        ],
      },
      {
        name: 'a',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: 't',
        type: 'tuple[]',
        components: [
          {
            name: 'x',
            type: 'uint256',
          },
          {
            name: 'y',
            type: 'uint256',
          },
        ],
      },
    ],
  },
  {
    name: 'v',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      {
        name: 's',
        type: 'tuple[2]',
        components: [
          {
            name: 'a',
            type: 'uint8',
          },
          {
            name: 'b',
            type: 'uint8[]',
          },
        ],
      },
      {
        name: 't',
        type: 'tuple',
        components: [
          {
            name: 'x',
            type: 'uint',
          },
          {
            name: 'y',
            type: 'uint',
          },
        ],
      },
      {
        name: 'a',
        type: 'uint256',
      },
    ],
    outputs: [],
  },
] as const

/**
 * WagmiMintExample
 * https://etherscan.io/address/0xaf0326d92b97df1221759476b072abfd8084f9be
 */
export const wagmiMintExampleAbi = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,

        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      { indexed: true, name: 'to', type: 'address' },
      {
        indexed: true,

        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'operator', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { internalType: 'bytes', name: '_data', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'operator', type: 'address' },
      { internalType: 'bool', name: 'approved', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

/**
 * WritingEditionsFactory
 * https://optimistic.etherscan.io/address/0x302f746eE2fDC10DDff63188f71639094717a766
 */
export const writingEditionsFactoryAbi = [
  {
    inputs: [
      { name: '_owner', type: 'address' },
      {
        internalType: 'address',
        name: '_treasuryConfiguration',
        type: 'address',
      },
      { name: '_maxLimit', type: 'uint256' },
      { internalType: 'bool', name: '_guardOn', type: 'bool' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'clone',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'oldBaseDescriptionURI',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'newBaseDescriptionURI',
        type: 'string',
      },
    ],
    name: 'BaseDescriptionURISet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'factory',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'clone',
        type: 'address',
      },
    ],
    name: 'CloneDeployed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'clone',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address',
      },
    ],
    name: 'EditionsDeployed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'bool', name: 'guard', type: 'bool' },
    ],
    name: 'FactoryGuardSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'factory',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'oldImplementation',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newImplementation',
        type: 'address',
      },
    ],
    name: 'FactoryImplementationSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'factory',
        type: 'address',
      },
      {
        indexed: false,

        name: 'oldLimit',
        type: 'uint256',
      },
      {
        indexed: false,

        name: 'newLimit',
        type: 'uint256',
      },
    ],
    name: 'FactoryLimitSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'clone',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'oldFundingRecipient',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newFundingRecipient',
        type: 'address',
      },
    ],
    name: 'FundingRecipientSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'oldImplementation',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newImplementation',
        type: 'address',
      },
    ],
    name: 'NewImplementation',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'clone',
        type: 'address',
      },
      {
        indexed: false,

        name: 'oldLimit',
        type: 'uint256',
      },
      {
        indexed: false,

        name: 'newLimit',
        type: 'uint256',
      },
    ],
    name: 'PriceSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'clone',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'renderer',
        type: 'address',
      },
    ],
    name: 'RendererSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'clone',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'oldRoyaltyRecipient',
        type: 'address',
      },
      {
        indexed: false,

        name: 'oldRoyaltyBPS',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newRoyaltyRecipient',
        type: 'address',
      },
      {
        indexed: false,

        name: 'newRoyaltyBPS',
        type: 'uint256',
      },
    ],
    name: 'RoyaltyChange',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'clone',
        type: 'address',
      },
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      {
        indexed: false,

        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'factory',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'clone',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'oldTributary',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newTributary',
        type: 'address',
      },
    ],
    name: 'TributarySet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'clone',
        type: 'address',
      },
      {
        indexed: false,

        name: 'oldLimit',
        type: 'uint256',
      },
      {
        indexed: false,

        name: 'newLimit',
        type: 'uint256',
      },
    ],
    name: 'WritingEditionLimitSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'clone',
        type: 'address',
      },
      {
        indexed: false,

        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        indexed: false,

        name: 'price',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'message',
        type: 'string',
      },
    ],
    name: 'WritingEditionPurchased',
    type: 'event',
  },
  {
    inputs: [],
    name: 'CREATE_TYPEHASH',
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'VERSION',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'baseDescriptionURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'cancelOwnershipTransfer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'string', name: 'symbol', type: 'string' },
          { internalType: 'string', name: 'description', type: 'string' },
          { internalType: 'string', name: 'imageURI', type: 'string' },
          { internalType: 'string', name: 'contentURI', type: 'string' },
          { name: 'price', type: 'uint8' },
          { name: 'limit', type: 'uint256' },
          {
            internalType: 'address',
            name: 'fundingRecipient',
            type: 'address',
          },
          { name: 'renderer', type: 'address' },
          { name: 'nonce', type: 'uint256' },
          { internalType: 'uint16', name: 'fee', type: 'uint16' },
        ],
        internalType: 'struct IWritingEditions.WritingEdition',
        name: 'edition',
        type: 'tuple',
      },
    ],
    name: 'create',
    outputs: [{ name: 'clone', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      {
        components: [
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'string', name: 'symbol', type: 'string' },
          { internalType: 'string', name: 'description', type: 'string' },
          { internalType: 'string', name: 'imageURI', type: 'string' },
          { internalType: 'string', name: 'contentURI', type: 'string' },
          { name: 'price', type: 'uint256' },
          { name: 'limit', type: 'uint256' },
          {
            internalType: 'address',
            name: 'fundingRecipient',
            type: 'address',
          },
          { name: 'renderer', type: 'address' },
          { name: 'nonce', type: 'uint256' },
          { internalType: 'uint16', name: 'fee', type: 'uint16' },
        ],
        internalType: 'struct IWritingEditions.WritingEdition',
        name: 'edition',
        type: 'tuple',
      },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { name: 'r', type: 'bytes32' },
      { name: 's', type: 'bytes32' },
      { name: 'tokenRecipient', type: 'address' },
      { internalType: 'string', name: 'message', type: 'string' },
    ],
    name: 'createWithSignature',
    outputs: [{ name: 'clone', type: 'address' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      {
        components: [
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'string', name: 'symbol', type: 'string' },
          { internalType: 'string', name: 'description', type: 'string' },
          { internalType: 'string', name: 'imageURI', type: 'string' },
          { internalType: 'string', name: 'contentURI', type: 'string' },
          { name: 'price', type: 'uint8' },
          { name: 'limit', type: 'uint256' },
          {
            internalType: 'address',
            name: 'fundingRecipient',
            type: 'address',
          },
          { name: 'renderer', type: 'address' },
          { name: 'nonce', type: 'uint256' },
          { internalType: 'uint16', name: 'fee', type: 'uint16' },
        ],
        internalType: 'struct IWritingEditions.WritingEdition',
        name: 'edition',
        type: 'tuple',
      },
    ],
    name: 'getSalt',
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'guardOn',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'implementation',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isNextOwner',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isOwner',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'salt', type: 'bytes32' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { name: 'r', type: 'bytes32' },
      { name: 's', type: 'bytes32' },
    ],
    name: 'isValid',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxLimit',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'o11y',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: '_implementation', type: 'address' },
      { name: 'salt', type: 'bytes32' },
    ],
    name: 'predictDeterministicAddress',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'clone', type: 'address' },
      { name: 'tokenRecipient', type: 'address' },
      { internalType: 'string', name: 'message', type: 'string' },
    ],
    name: 'purchaseThroughFactory',
    outputs: [{ name: 'tokenId', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '', type: 'bytes32' }],
    name: 'salts',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bool', name: '_guardOn', type: 'bool' }],
    name: 'setGuard',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '_implementation', type: 'address' }],
    name: 'setImplementation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '_maxLimit', type: 'uint256' }],
    name: 'setLimit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'clone', type: 'address' },
      { name: '_tributary', type: 'address' },
    ],
    name: 'setTributary',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'nextOwner_', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'treasuryConfiguration',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

/**
 * ENSRegistryWithFallback
 * https://etherscan.io/address/0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e
 */
export const ensRegistryWithFallbackAbi = [
  {
    inputs: [{ internalType: 'contract ENS', name: '_old', type: 'address' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      { indexed: false, internalType: 'bool', name: 'approved', type: 'bool' },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'node', type: 'bytes32' },
      {
        indexed: true,

        name: 'label',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'NewOwner',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'node', type: 'bytes32' },
      {
        indexed: false,
        internalType: 'address',
        name: 'resolver',
        type: 'address',
      },
    ],
    name: 'NewResolver',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'node', type: 'bytes32' },
      { indexed: false, internalType: 'uint64', name: 'ttl', type: 'uint64' },
    ],
    name: 'NewTTL',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'node', type: 'bytes32' },
      {
        indexed: false,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    constant: true,
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'operator', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'old',
    outputs: [{ internalType: 'contract ENS', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: 'node', type: 'bytes32' }],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: 'node', type: 'bytes32' }],
    name: 'recordExists',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: 'node', type: 'bytes32' }],
    name: 'resolver',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'operator', type: 'address' },
      { internalType: 'bool', name: 'approved', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'node', type: 'bytes32' },
      { internalType: 'address', name: 'owner', type: 'address' },
    ],
    name: 'setOwner',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'node', type: 'bytes32' },
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'resolver', type: 'address' },
      { internalType: 'uint64', name: 'ttl', type: 'uint64' },
    ],
    name: 'setRecord',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'node', type: 'bytes32' },
      { internalType: 'address', name: 'resolver', type: 'address' },
    ],
    name: 'setResolver',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'node', type: 'bytes32' },
      { name: 'label', type: 'bytes32' },
      { internalType: 'address', name: 'owner', type: 'address' },
    ],
    name: 'setSubnodeOwner',
    outputs: [{ name: '', type: 'bytes32' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'node', type: 'bytes32' },
      { name: 'label', type: 'bytes32' },
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'resolver', type: 'address' },
      { internalType: 'uint64', name: 'ttl', type: 'uint64' },
    ],
    name: 'setSubnodeRecord',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'node', type: 'bytes32' },
      { internalType: 'uint64', name: 'ttl', type: 'uint64' },
    ],
    name: 'setTTL',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: 'node', type: 'bytes32' }],
    name: 'ttl',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
] as const

/**
 * NounsAuctionHouse
 * https://etherscan.io/address/0x5b2003ca8fe9ffb93684ce377f52b415c7dc0216
 */
export const nounsAuctionHouseAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,

        name: 'nounId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,

        name: 'value',
        type: 'uint256',
      },
      { indexed: false, internalType: 'bool', name: 'extended', type: 'bool' },
    ],
    name: 'AuctionBid',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,

        name: 'nounId',
        type: 'uint256',
      },
      {
        indexed: false,

        name: 'startTime',
        type: 'uint256',
      },
      {
        indexed: false,

        name: 'endTime',
        type: 'uint256',
      },
    ],
    name: 'AuctionCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,

        name: 'nounId',
        type: 'uint256',
      },
      {
        indexed: false,

        name: 'endTime',
        type: 'uint256',
      },
    ],
    name: 'AuctionExtended',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,

        name: 'minBidIncrementPercentage',
        type: 'uint256',
      },
    ],
    name: 'AuctionMinBidIncrementPercentageUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,

        name: 'reservePrice',
        type: 'uint256',
      },
    ],
    name: 'AuctionReservePriceUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,

        name: 'nounId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'winner',
        type: 'address',
      },
      {
        indexed: false,

        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'AuctionSettled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,

        name: 'timeBuffer',
        type: 'uint256',
      },
    ],
    name: 'AuctionTimeBufferUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    inputs: [],
    name: 'auction',
    outputs: [
      { name: 'nounId', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'startTime', type: 'uint256' },
      { name: 'endTime', type: 'uint256' },
      { internalType: 'address payable', name: 'bidder', type: 'address' },
      { internalType: 'bool', name: 'settled', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'nounId', type: 'uint256' }],
    name: 'createBid',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'duration',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'contract INounsToken', name: '_nouns', type: 'address' },
      { internalType: 'address', name: '_weth', type: 'address' },
      { name: '_timeBuffer', type: 'uint256' },
      { name: '_reservePrice', type: 'uint256' },
      {
        internalType: 'uint8',
        name: '_minBidIncrementPercentage',
        type: 'uint8',
      },
      { name: '_duration', type: 'uint256' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'minBidIncrementPercentage',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nouns',
    outputs: [
      { internalType: 'contract INounsToken', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'reservePrice',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: '_minBidIncrementPercentage',
        type: 'uint8',
      },
    ],
    name: 'setMinBidIncrementPercentage',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '_reservePrice', type: 'uint256' }],
    name: 'setReservePrice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '_timeBuffer', type: 'uint256' }],
    name: 'setTimeBuffer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'settleAuction',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'settleCurrentAndCreateNewAuction',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'timeBuffer',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'weth',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

/**
 * ENS
 * https://etherscan.io/address/0x314159265dd8dbb310642f98f50c066173c1259b
 */
export const ensAbi = [
  {
    constant: true,
    inputs: [{ name: 'node', type: 'bytes32' }],
    name: 'resolver',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: 'node', type: 'bytes32' }],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'node', type: 'bytes32' },
      { name: 'label', type: 'bytes32' },
      { name: 'owner', type: 'address' },
    ],
    name: 'setSubnodeOwner',
    outputs: [],
    payable: false,
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'node', type: 'bytes32' },
      { name: 'ttl', type: 'uint64' },
    ],
    name: 'setTTL',
    outputs: [],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: 'node', type: 'bytes32' }],
    name: 'ttl',
    outputs: [{ name: '', type: 'uint64' }],
    payable: false,
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'node', type: 'bytes32' },
      { name: 'resolver', type: 'address' },
    ],
    name: 'setResolver',
    outputs: [],
    payable: false,
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'node', type: 'bytes32' },
      { name: 'owner', type: 'address' },
    ],
    name: 'setOwner',
    outputs: [],
    payable: false,
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'node', type: 'bytes32' },
      { indexed: false, name: 'owner', type: 'address' },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'node', type: 'bytes32' },
      { indexed: true, name: 'label', type: 'bytes32' },
      { indexed: false, name: 'owner', type: 'address' },
    ],
    name: 'NewOwner',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'node', type: 'bytes32' },
      { indexed: false, name: 'resolver', type: 'address' },
    ],
    name: 'NewResolver',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'node', type: 'bytes32' },
      { indexed: false, name: 'ttl', type: 'uint64' },
    ],
    name: 'NewTTL',
    type: 'event',
  },
] as const

/**
 * Seaport
 * https://etherscan.io/address/0x00000000000001ad428e4906ae43d8f9852d0dd6
 */
export const seaportAbi = [
  {
    inputs: [{ name: 'conduitController', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        components: [
          { name: 'offerer', type: 'address' },
          { name: 'zone', type: 'address' },
          {
            components: [
              { name: 'itemType', type: 'uint8' },
              { name: 'token', type: 'address' },
              {
                name: 'identifierOrCriteria',
                type: 'uint256',
              },
              { name: 'startAmount', type: 'uint256' },
              { name: 'endAmount', type: 'uint256' },
            ],

            name: 'offer',
            type: 'tuple[]',
          },
          {
            components: [
              { name: 'itemType', type: 'uint8' },
              { name: 'token', type: 'address' },
              {
                name: 'identifierOrCriteria',
                type: 'uint256',
              },
              { name: 'startAmount', type: 'uint256' },
              { name: 'endAmount', type: 'uint256' },
              {
                name: 'recipient',
                type: 'address',
              },
            ],

            name: 'consideration',
            type: 'tuple[]',
          },
          { name: 'orderType', type: 'uint8' },
          { name: 'startTime', type: 'uint256' },
          { name: 'endTime', type: 'uint256' },
          { name: 'zoneHash', type: 'bytes32' },
          { name: 'salt', type: 'uint256' },
          { name: 'conduitKey', type: 'bytes32' },
          { name: 'counter', type: 'uint256' },
        ],
        name: 'orders',
        type: 'tuple[]',
      },
    ],
    name: 'cancel',
    outputs: [{ internalType: 'bool', name: 'cancelled', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { name: 'offerer', type: 'address' },
              { name: 'zone', type: 'address' },
              {
                components: [
                  {
                    internalType: 'enumItemType',
                    name: 'itemType',
                    type: 'uint8',
                  },
                  { name: 'token', type: 'address' },
                  {
                    name: 'identifierOrCriteria',
                    type: 'uint256',
                  },
                  {
                    name: 'startAmount',
                    type: 'uint256',
                  },
                  {
                    name: 'endAmount',
                    type: 'uint256',
                  },
                ],

                name: 'offer',
                type: 'tuple[]',
              },
              {
                components: [
                  {
                    internalType: 'enumItemType',
                    name: 'itemType',
                    type: 'uint8',
                  },
                  { name: 'token', type: 'address' },
                  {
                    name: 'identifierOrCriteria',
                    type: 'uint256',
                  },
                  {
                    name: 'startAmount',
                    type: 'uint256',
                  },
                  {
                    name: 'endAmount',
                    type: 'uint256',
                  },
                  {
                    name: 'recipient',
                    type: 'address',
                  },
                ],

                name: 'consideration',
                type: 'tuple[]',
              },
              {
                name: 'orderType',
                type: 'uint8',
              },
              { name: 'startTime', type: 'uint256' },
              { name: 'endTime', type: 'uint256' },
              { name: 'zoneHash', type: 'bytes32' },
              { name: 'salt', type: 'uint256' },
              { name: 'conduitKey', type: 'bytes32' },
              {
                name: 'totalOriginalConsiderationItems',
                type: 'uint256',
              },
            ],
            internalType: 'structOrderParameters',
            name: 'parameters',
            type: 'tuple',
          },
          { internalType: 'uint120', name: 'numerator', type: 'uint120' },
          { internalType: 'uint120', name: 'denominator', type: 'uint120' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
          { internalType: 'bytes', name: 'extraData', type: 'bytes' },
        ],
        internalType: 'structAdvancedOrder',
        name: 'advancedOrder',
        type: 'tuple',
      },
      {
        components: [
          { name: 'orderIndex', type: 'uint256' },
          { internalType: 'enumSide', name: 'side', type: 'uint8' },
          { name: 'index', type: 'uint256' },
          { name: 'identifier', type: 'uint256' },
          {
            internalType: 'bytes32[]',
            name: 'criteriaProof',
            type: 'bytes32[]',
          },
        ],
        internalType: 'structCriteriaResolver[]',
        name: 'criteriaResolvers',
        type: 'tuple[]',
      },
      { name: 'fulfillerConduitKey', type: 'bytes32' },
      { name: 'recipient', type: 'address' },
    ],
    name: 'fulfillAdvancedOrder',
    outputs: [{ internalType: 'bool', name: 'fulfilled', type: 'bool' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { name: 'offerer', type: 'address' },
              { name: 'zone', type: 'address' },
              {
                components: [
                  {
                    internalType: 'enumItemType',
                    name: 'itemType',
                    type: 'uint8',
                  },
                  { name: 'token', type: 'address' },
                  {
                    name: 'identifierOrCriteria',
                    type: 'uint256',
                  },
                  {
                    name: 'startAmount',
                    type: 'uint256',
                  },
                  {
                    name: 'endAmount',
                    type: 'uint256',
                  },
                ],

                name: 'offer',
                type: 'tuple[]',
              },
              {
                components: [
                  {
                    internalType: 'enumItemType',
                    name: 'itemType',
                    type: 'uint8',
                  },
                  { name: 'token', type: 'address' },
                  {
                    name: 'identifierOrCriteria',
                    type: 'uint256',
                  },
                  {
                    name: 'startAmount',
                    type: 'uint256',
                  },
                  {
                    name: 'endAmount',
                    type: 'uint256',
                  },
                  {
                    name: 'recipient',
                    type: 'address',
                  },
                ],

                name: 'consideration',
                type: 'tuple[]',
              },
              {
                name: 'orderType',
                type: 'uint8',
              },
              { name: 'startTime', type: 'uint256' },
              { name: 'endTime', type: 'uint256' },
              { name: 'zoneHash', type: 'bytes32' },
              { name: 'salt', type: 'uint256' },
              { name: 'conduitKey', type: 'bytes32' },
              {
                name: 'totalOriginalConsiderationItems',
                type: 'uint256',
              },
            ],
            internalType: 'structOrderParameters',
            name: 'parameters',
            type: 'tuple',
          },
          { internalType: 'uint120', name: 'numerator', type: 'uint120' },
          { internalType: 'uint120', name: 'denominator', type: 'uint120' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
          { internalType: 'bytes', name: 'extraData', type: 'bytes' },
        ],
        internalType: 'structAdvancedOrder[]',
        name: 'advancedOrders',
        type: 'tuple[]',
      },
      {
        components: [
          { name: 'orderIndex', type: 'uint256' },
          { internalType: 'enumSide', name: 'side', type: 'uint8' },
          { name: 'index', type: 'uint256' },
          { name: 'identifier', type: 'uint256' },
          {
            internalType: 'bytes32[]',
            name: 'criteriaProof',
            type: 'bytes32[]',
          },
        ],
        internalType: 'structCriteriaResolver[]',
        name: 'criteriaResolvers',
        type: 'tuple[]',
      },
      {
        components: [
          { name: 'orderIndex', type: 'uint256' },
          { name: 'itemIndex', type: 'uint256' },
        ],
        internalType: 'structFulfillmentComponent[][]',
        name: 'offerFulfillments',
        type: 'tuple[][]',
      },
      {
        components: [
          { name: 'orderIndex', type: 'uint256' },
          { name: 'itemIndex', type: 'uint256' },
        ],
        internalType: 'structFulfillmentComponent[][]',
        name: 'considerationFulfillments',
        type: 'tuple[][]',
      },
      { name: 'fulfillerConduitKey', type: 'bytes32' },
      { name: 'recipient', type: 'address' },
      { name: 'maximumFulfilled', type: 'uint256' },
    ],
    name: 'fulfillAvailableAdvancedOrders',
    outputs: [
      { internalType: 'bool[]', name: 'availableOrders', type: 'bool[]' },
      {
        components: [
          {
            components: [
              { name: 'itemType', type: 'uint8' },
              { name: 'token', type: 'address' },
              { name: 'identifier', type: 'uint256' },
              { name: 'amount', type: 'uint256' },
              {
                name: 'recipient',
                type: 'address',
              },
            ],
            internalType: 'structReceivedItem',
            name: 'item',
            type: 'tuple',
          },
          { name: 'offerer', type: 'address' },
          { name: 'conduitKey', type: 'bytes32' },
        ],
        internalType: 'structExecution[]',
        name: 'executions',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { name: 'offerer', type: 'address' },
              { name: 'zone', type: 'address' },
              {
                components: [
                  {
                    internalType: 'enumItemType',
                    name: 'itemType',
                    type: 'uint8',
                  },
                  { name: 'token', type: 'address' },
                  {
                    name: 'identifierOrCriteria',
                    type: 'uint256',
                  },
                  {
                    name: 'startAmount',
                    type: 'uint256',
                  },
                  {
                    name: 'endAmount',
                    type: 'uint256',
                  },
                ],

                name: 'offer',
                type: 'tuple[]',
              },
              {
                components: [
                  {
                    internalType: 'enumItemType',
                    name: 'itemType',
                    type: 'uint8',
                  },
                  { name: 'token', type: 'address' },
                  {
                    name: 'identifierOrCriteria',
                    type: 'uint256',
                  },
                  {
                    name: 'startAmount',
                    type: 'uint256',
                  },
                  {
                    name: 'endAmount',
                    type: 'uint256',
                  },
                  {
                    name: 'recipient',
                    type: 'address',
                  },
                ],

                name: 'consideration',
                type: 'tuple[]',
              },
              {
                name: 'orderType',
                type: 'uint8',
              },
              { name: 'startTime', type: 'uint256' },
              { name: 'endTime', type: 'uint256' },
              { name: 'zoneHash', type: 'bytes32' },
              { name: 'salt', type: 'uint256' },
              { name: 'conduitKey', type: 'bytes32' },
              {
                name: 'totalOriginalConsiderationItems',
                type: 'uint256',
              },
            ],
            internalType: 'structOrderParameters',
            name: 'parameters',
            type: 'tuple',
          },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'structOrder[]',
        name: 'orders',
        type: 'tuple[]',
      },
      {
        components: [
          { name: 'orderIndex', type: 'uint256' },
          { name: 'itemIndex', type: 'uint256' },
        ],
        internalType: 'structFulfillmentComponent[][]',
        name: 'offerFulfillments',
        type: 'tuple[][]',
      },
      {
        components: [
          { name: 'orderIndex', type: 'uint256' },
          { name: 'itemIndex', type: 'uint256' },
        ],
        internalType: 'structFulfillmentComponent[][]',
        name: 'considerationFulfillments',
        type: 'tuple[][]',
      },
      { name: 'fulfillerConduitKey', type: 'bytes32' },
      { name: 'maximumFulfilled', type: 'uint256' },
    ],
    name: 'fulfillAvailableOrders',
    outputs: [
      { internalType: 'bool[]', name: 'availableOrders', type: 'bool[]' },
      {
        components: [
          {
            components: [
              { name: 'itemType', type: 'uint8' },
              { name: 'token', type: 'address' },
              { name: 'identifier', type: 'uint256' },
              { name: 'amount', type: 'uint256' },
              {
                name: 'recipient',
                type: 'address',
              },
            ],
            internalType: 'structReceivedItem',
            name: 'item',
            type: 'tuple',
          },
          { name: 'offerer', type: 'address' },
          { name: 'conduitKey', type: 'bytes32' },
        ],
        internalType: 'structExecution[]',
        name: 'executions',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'considerationToken',
            type: 'address',
          },
          {
            name: 'considerationIdentifier',
            type: 'uint256',
          },
          {
            name: 'considerationAmount',
            type: 'uint256',
          },
          { name: 'offerer', type: 'address' },
          { name: 'zone', type: 'address' },
          { name: 'offerToken', type: 'address' },
          { name: 'offerIdentifier', type: 'uint256' },
          { name: 'offerAmount', type: 'uint256' },
          {
            internalType: 'enumBasicOrderType',
            name: 'basicOrderType',
            type: 'uint8',
          },
          { name: 'startTime', type: 'uint256' },
          { name: 'endTime', type: 'uint256' },
          { name: 'zoneHash', type: 'bytes32' },
          { name: 'salt', type: 'uint256' },
          {
            name: 'offererConduitKey',
            type: 'bytes32',
          },
          {
            name: 'fulfillerConduitKey',
            type: 'bytes32',
          },
          {
            name: 'totalOriginalAdditionalRecipients',
            type: 'uint256',
          },
          {
            components: [
              { name: 'amount', type: 'uint256' },
              {
                name: 'recipient',
                type: 'address',
              },
            ],
            internalType: 'structAdditionalRecipient[]',
            name: 'additionalRecipients',
            type: 'tuple[]',
          },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'structBasicOrderParameters',
        name: 'parameters',
        type: 'tuple',
      },
    ],
    name: 'fulfillBasicOrder',
    outputs: [{ internalType: 'bool', name: 'fulfilled', type: 'bool' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'considerationToken',
            type: 'address',
          },
          {
            name: 'considerationIdentifier',
            type: 'uint256',
          },
          {
            name: 'considerationAmount',
            type: 'uint256',
          },
          { name: 'offerer', type: 'address' },
          { name: 'zone', type: 'address' },
          { name: 'offerToken', type: 'address' },
          { name: 'offerIdentifier', type: 'uint256' },
          { name: 'offerAmount', type: 'uint256' },
          {
            internalType: 'enumBasicOrderType',
            name: 'basicOrderType',
            type: 'uint8',
          },
          { name: 'startTime', type: 'uint256' },
          { name: 'endTime', type: 'uint256' },
          { name: 'zoneHash', type: 'bytes32' },
          { name: 'salt', type: 'uint256' },
          {
            name: 'offererConduitKey',
            type: 'bytes32',
          },
          {
            name: 'fulfillerConduitKey',
            type: 'bytes32',
          },
          {
            name: 'totalOriginalAdditionalRecipients',
            type: 'uint256',
          },
          {
            components: [
              { name: 'amount', type: 'uint256' },
              {
                name: 'recipient',
                type: 'address',
              },
            ],
            internalType: 'structAdditionalRecipient[]',
            name: 'additionalRecipients',
            type: 'tuple[]',
          },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'structBasicOrderParameters',
        name: 'parameters',
        type: 'tuple',
      },
    ],
    name: 'fulfillBasicOrder_efficient_6GL6yc',
    outputs: [{ internalType: 'bool', name: 'fulfilled', type: 'bool' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { name: 'offerer', type: 'address' },
              { name: 'zone', type: 'address' },
              {
                components: [
                  {
                    internalType: 'enumItemType',
                    name: 'itemType',
                    type: 'uint8',
                  },
                  { name: 'token', type: 'address' },
                  {
                    name: 'identifierOrCriteria',
                    type: 'uint256',
                  },
                  {
                    name: 'startAmount',
                    type: 'uint256',
                  },
                  {
                    name: 'endAmount',
                    type: 'uint256',
                  },
                ],

                name: 'offer',
                type: 'tuple[]',
              },
              {
                components: [
                  {
                    internalType: 'enumItemType',
                    name: 'itemType',
                    type: 'uint8',
                  },
                  { name: 'token', type: 'address' },
                  {
                    name: 'identifierOrCriteria',
                    type: 'uint256',
                  },
                  {
                    name: 'startAmount',
                    type: 'uint256',
                  },
                  {
                    name: 'endAmount',
                    type: 'uint256',
                  },
                  {
                    name: 'recipient',
                    type: 'address',
                  },
                ],

                name: 'consideration',
                type: 'tuple[]',
              },
              {
                name: 'orderType',
                type: 'uint8',
              },
              { name: 'startTime', type: 'uint256' },
              { name: 'endTime', type: 'uint256' },
              { name: 'zoneHash', type: 'bytes32' },
              { name: 'salt', type: 'uint256' },
              { name: 'conduitKey', type: 'bytes32' },
              {
                name: 'totalOriginalConsiderationItems',
                type: 'uint256',
              },
            ],
            internalType: 'structOrderParameters',
            name: 'parameters',
            type: 'tuple',
          },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'structOrder',
        name: 'order',
        type: 'tuple',
      },
      { name: 'fulfillerConduitKey', type: 'bytes32' },
    ],
    name: 'fulfillOrder',
    outputs: [{ internalType: 'bool', name: 'fulfilled', type: 'bool' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'contractOfferer', type: 'address' }],
    name: 'getContractOffererNonce',
    outputs: [{ name: 'nonce', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'offerer', type: 'address' }],
    name: 'getCounter',
    outputs: [{ name: 'counter', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'offerer', type: 'address' },
          { name: 'zone', type: 'address' },
          {
            components: [
              { name: 'itemType', type: 'uint8' },
              { name: 'token', type: 'address' },
              {
                name: 'identifierOrCriteria',
                type: 'uint256',
              },
              { name: 'startAmount', type: 'uint256' },
              { name: 'endAmount', type: 'uint256' },
            ],

            name: 'offer',
            type: 'tuple[]',
          },
          {
            components: [
              { name: 'itemType', type: 'uint8' },
              { name: 'token', type: 'address' },
              {
                name: 'identifierOrCriteria',
                type: 'uint256',
              },
              { name: 'startAmount', type: 'uint256' },
              { name: 'endAmount', type: 'uint256' },
              {
                name: 'recipient',
                type: 'address',
              },
            ],

            name: 'consideration',
            type: 'tuple[]',
          },
          { name: 'orderType', type: 'uint8' },
          { name: 'startTime', type: 'uint256' },
          { name: 'endTime', type: 'uint256' },
          { name: 'zoneHash', type: 'bytes32' },
          { name: 'salt', type: 'uint256' },
          { name: 'conduitKey', type: 'bytes32' },
          { name: 'counter', type: 'uint256' },
        ],
        internalType: 'structOrderComponents',
        name: 'order',
        type: 'tuple',
      },
    ],
    name: 'getOrderHash',
    outputs: [{ name: 'orderHash', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'orderHash', type: 'bytes32' }],
    name: 'getOrderStatus',
    outputs: [
      { internalType: 'bool', name: 'isValidated', type: 'bool' },
      { internalType: 'bool', name: 'isCancelled', type: 'bool' },
      { name: 'totalFilled', type: 'uint256' },
      { name: 'totalSize', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'incrementCounter',
    outputs: [{ name: 'newCounter', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'information',
    outputs: [
      { internalType: 'string', name: 'version', type: 'string' },
      { name: 'domainSeparator', type: 'bytes32' },
      { name: 'conduitController', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { name: 'offerer', type: 'address' },
              { name: 'zone', type: 'address' },
              {
                components: [
                  {
                    internalType: 'enumItemType',
                    name: 'itemType',
                    type: 'uint8',
                  },
                  { name: 'token', type: 'address' },
                  {
                    name: 'identifierOrCriteria',
                    type: 'uint256',
                  },
                  {
                    name: 'startAmount',
                    type: 'uint256',
                  },
                  {
                    name: 'endAmount',
                    type: 'uint256',
                  },
                ],

                name: 'offer',
                type: 'tuple[]',
              },
              {
                components: [
                  {
                    internalType: 'enumItemType',
                    name: 'itemType',
                    type: 'uint8',
                  },
                  { name: 'token', type: 'address' },
                  {
                    name: 'identifierOrCriteria',
                    type: 'uint256',
                  },
                  {
                    name: 'startAmount',
                    type: 'uint256',
                  },
                  {
                    name: 'endAmount',
                    type: 'uint256',
                  },
                  {
                    name: 'recipient',
                    type: 'address',
                  },
                ],

                name: 'consideration',
                type: 'tuple[]',
              },
              {
                name: 'orderType',
                type: 'uint8',
              },
              { name: 'startTime', type: 'uint256' },
              { name: 'endTime', type: 'uint256' },
              { name: 'zoneHash', type: 'bytes32' },
              { name: 'salt', type: 'uint256' },
              { name: 'conduitKey', type: 'bytes32' },
              {
                name: 'totalOriginalConsiderationItems',
                type: 'uint256',
              },
            ],
            internalType: 'structOrderParameters',
            name: 'parameters',
            type: 'tuple',
          },
          { internalType: 'uint120', name: 'numerator', type: 'uint120' },
          { internalType: 'uint120', name: 'denominator', type: 'uint120' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
          { internalType: 'bytes', name: 'extraData', type: 'bytes' },
        ],
        internalType: 'structAdvancedOrder[]',
        name: 'orders',
        type: 'tuple[]',
      },
      {
        components: [
          { name: 'orderIndex', type: 'uint256' },
          { internalType: 'enumSide', name: 'side', type: 'uint8' },
          { name: 'index', type: 'uint256' },
          { name: 'identifier', type: 'uint256' },
          {
            internalType: 'bytes32[]',
            name: 'criteriaProof',
            type: 'bytes32[]',
          },
        ],
        internalType: 'structCriteriaResolver[]',
        name: 'criteriaResolvers',
        type: 'tuple[]',
      },
      {
        components: [
          {
            components: [
              { name: 'orderIndex', type: 'uint256' },
              { name: 'itemIndex', type: 'uint256' },
            ],
            internalType: 'structFulfillmentComponent[]',
            name: 'offerComponents',
            type: 'tuple[]',
          },
          {
            components: [
              { name: 'orderIndex', type: 'uint256' },
              { name: 'itemIndex', type: 'uint256' },
            ],
            internalType: 'structFulfillmentComponent[]',
            name: 'considerationComponents',
            type: 'tuple[]',
          },
        ],
        internalType: 'structFulfillment[]',
        name: 'fulfillments',
        type: 'tuple[]',
      },
      { name: 'recipient', type: 'address' },
    ],
    name: 'matchAdvancedOrders',
    outputs: [
      {
        components: [
          {
            components: [
              { name: 'itemType', type: 'uint8' },
              { name: 'token', type: 'address' },
              { name: 'identifier', type: 'uint256' },
              { name: 'amount', type: 'uint256' },
              {
                name: 'recipient',
                type: 'address',
              },
            ],
            internalType: 'structReceivedItem',
            name: 'item',
            type: 'tuple',
          },
          { name: 'offerer', type: 'address' },
          { name: 'conduitKey', type: 'bytes32' },
        ],
        internalType: 'structExecution[]',
        name: 'executions',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { name: 'offerer', type: 'address' },
              { name: 'zone', type: 'address' },
              {
                components: [
                  {
                    internalType: 'enumItemType',
                    name: 'itemType',
                    type: 'uint8',
                  },
                  { name: 'token', type: 'address' },
                  {
                    name: 'identifierOrCriteria',
                    type: 'uint256',
                  },
                  {
                    name: 'startAmount',
                    type: 'uint256',
                  },
                  {
                    name: 'endAmount',
                    type: 'uint256',
                  },
                ],

                name: 'offer',
                type: 'tuple[]',
              },
              {
                components: [
                  {
                    internalType: 'enumItemType',
                    name: 'itemType',
                    type: 'uint8',
                  },
                  { name: 'token', type: 'address' },
                  {
                    name: 'identifierOrCriteria',
                    type: 'uint256',
                  },
                  {
                    name: 'startAmount',
                    type: 'uint256',
                  },
                  {
                    name: 'endAmount',
                    type: 'uint256',
                  },
                  {
                    name: 'recipient',
                    type: 'address',
                  },
                ],

                name: 'consideration',
                type: 'tuple[]',
              },
              {
                name: 'orderType',
                type: 'uint8',
              },
              { name: 'startTime', type: 'uint256' },
              { name: 'endTime', type: 'uint256' },
              { name: 'zoneHash', type: 'bytes32' },
              { name: 'salt', type: 'uint256' },
              { name: 'conduitKey', type: 'bytes32' },
              {
                name: 'totalOriginalConsiderationItems',
                type: 'uint256',
              },
            ],
            internalType: 'structOrderParameters',
            name: 'parameters',
            type: 'tuple',
          },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'structOrder[]',
        name: 'orders',
        type: 'tuple[]',
      },
      {
        components: [
          {
            components: [
              { name: 'orderIndex', type: 'uint256' },
              { name: 'itemIndex', type: 'uint256' },
            ],
            internalType: 'structFulfillmentComponent[]',
            name: 'offerComponents',
            type: 'tuple[]',
          },
          {
            components: [
              { name: 'orderIndex', type: 'uint256' },
              { name: 'itemIndex', type: 'uint256' },
            ],
            internalType: 'structFulfillmentComponent[]',
            name: 'considerationComponents',
            type: 'tuple[]',
          },
        ],
        internalType: 'structFulfillment[]',
        name: 'fulfillments',
        type: 'tuple[]',
      },
    ],
    name: 'matchOrders',
    outputs: [
      {
        components: [
          {
            components: [
              { name: 'itemType', type: 'uint8' },
              { name: 'token', type: 'address' },
              { name: 'identifier', type: 'uint256' },
              { name: 'amount', type: 'uint256' },
              {
                name: 'recipient',
                type: 'address',
              },
            ],
            internalType: 'structReceivedItem',
            name: 'item',
            type: 'tuple',
          },
          { name: 'offerer', type: 'address' },
          { name: 'conduitKey', type: 'bytes32' },
        ],
        internalType: 'structExecution[]',
        name: 'executions',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: 'contractName', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { name: 'offerer', type: 'address' },
              { name: 'zone', type: 'address' },
              {
                components: [
                  {
                    internalType: 'enumItemType',
                    name: 'itemType',
                    type: 'uint8',
                  },
                  { name: 'token', type: 'address' },
                  {
                    name: 'identifierOrCriteria',
                    type: 'uint256',
                  },
                  {
                    name: 'startAmount',
                    type: 'uint256',
                  },
                  {
                    name: 'endAmount',
                    type: 'uint256',
                  },
                ],

                name: 'offer',
                type: 'tuple[]',
              },
              {
                components: [
                  {
                    internalType: 'enumItemType',
                    name: 'itemType',
                    type: 'uint8',
                  },
                  { name: 'token', type: 'address' },
                  {
                    name: 'identifierOrCriteria',
                    type: 'uint256',
                  },
                  {
                    name: 'startAmount',
                    type: 'uint256',
                  },
                  {
                    name: 'endAmount',
                    type: 'uint256',
                  },
                  {
                    name: 'recipient',
                    type: 'address',
                  },
                ],

                name: 'consideration',
                type: 'tuple[]',
              },
              {
                name: 'orderType',
                type: 'uint8',
              },
              { name: 'startTime', type: 'uint256' },
              { name: 'endTime', type: 'uint256' },
              { name: 'zoneHash', type: 'bytes32' },
              { name: 'salt', type: 'uint256' },
              { name: 'conduitKey', type: 'bytes32' },
              {
                name: 'totalOriginalConsiderationItems',
                type: 'uint256',
              },
            ],
            internalType: 'structOrderParameters',
            name: 'parameters',
            type: 'tuple',
          },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'structOrder[]',
        name: 'orders',
        type: 'tuple[]',
      },
    ],
    name: 'validate',
    outputs: [{ internalType: 'bool', name: 'validated', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { inputs: [], name: 'BadContractSignature', type: 'error' },
  { inputs: [], name: 'BadFraction', type: 'error' },
  {
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'BadReturnValueFromERC20OnTransfer',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'uint8', name: 'v', type: 'uint8' }],
    name: 'BadSignatureV',
    type: 'error',
  },
  { inputs: [], name: 'CannotCancelOrder', type: 'error' },
  {
    inputs: [],
    name: 'ConsiderationCriteriaResolverOutOfRange',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ConsiderationLengthNotEqualToTotalOriginal',
    type: 'error',
  },
  {
    inputs: [
      { name: 'orderIndex', type: 'uint256' },
      { name: 'considerationIndex', type: 'uint256' },
      { name: 'shortfallAmount', type: 'uint256' },
    ],
    name: 'ConsiderationNotMet',
    type: 'error',
  },
  { inputs: [], name: 'CriteriaNotEnabledForItem', type: 'error' },
  {
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { internalType: 'uint256[]', name: 'identifiers', type: 'uint256[]' },
      { internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' },
    ],
    name: 'ERC1155BatchTransferGenericFailure',
    type: 'error',
  },
  { inputs: [], name: 'InexactFraction', type: 'error' },
  { inputs: [], name: 'InsufficientNativeTokensSupplied', type: 'error' },
  { inputs: [], name: 'Invalid1155BatchTransferEncoding', type: 'error' },
  { inputs: [], name: 'InvalidBasicOrderParameterEncoding', type: 'error' },
  {
    inputs: [{ name: 'conduit', type: 'address' }],
    name: 'InvalidCallToConduit',
    type: 'error',
  },
  {
    inputs: [
      { name: 'conduitKey', type: 'bytes32' },
      { name: 'conduit', type: 'address' },
    ],
    name: 'InvalidConduit',
    type: 'error',
  },
  {
    inputs: [{ name: 'orderHash', type: 'bytes32' }],
    name: 'InvalidContractOrder',
    type: 'error',
  },
  {
    inputs: [{ name: 'amount', type: 'uint256' }],
    name: 'InvalidERC721TransferAmount',
    type: 'error',
  },
  { inputs: [], name: 'InvalidFulfillmentComponentData', type: 'error' },
  {
    inputs: [{ name: 'value', type: 'uint256' }],
    name: 'InvalidMsgValue',
    type: 'error',
  },
  { inputs: [], name: 'InvalidNativeOfferItem', type: 'error' },
  { inputs: [], name: 'InvalidProof', type: 'error' },
  {
    inputs: [{ name: 'orderHash', type: 'bytes32' }],
    name: 'InvalidRestrictedOrder',
    type: 'error',
  },
  { inputs: [], name: 'InvalidSignature', type: 'error' },
  { inputs: [], name: 'InvalidSigner', type: 'error' },
  {
    inputs: [
      { name: 'startTime', type: 'uint256' },
      { name: 'endTime', type: 'uint256' },
    ],
    name: 'InvalidTime',
    type: 'error',
  },
  {
    inputs: [{ name: 'fulfillmentIndex', type: 'uint256' }],
    name: 'MismatchedFulfillmentOfferAndConsiderationComponents',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'enumSide', name: 'side', type: 'uint8' }],
    name: 'MissingFulfillmentComponentOnAggregation',
    type: 'error',
  },
  { inputs: [], name: 'MissingItemAmount', type: 'error' },
  { inputs: [], name: 'MissingOriginalConsiderationItems', type: 'error' },
  {
    inputs: [
      { name: 'account', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'NativeTokenTransferGenericFailure',
    type: 'error',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'NoContract',
    type: 'error',
  },
  { inputs: [], name: 'NoReentrantCalls', type: 'error' },
  { inputs: [], name: 'NoSpecifiedOrdersAvailable', type: 'error' },
  {
    inputs: [],
    name: 'OfferAndConsiderationRequiredOnFulfillment',
    type: 'error',
  },
  { inputs: [], name: 'OfferCriteriaResolverOutOfRange', type: 'error' },
  {
    inputs: [{ name: 'orderHash', type: 'bytes32' }],
    name: 'OrderAlreadyFilled',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'enumSide', name: 'side', type: 'uint8' }],
    name: 'OrderCriteriaResolverOutOfRange',
    type: 'error',
  },
  {
    inputs: [{ name: 'orderHash', type: 'bytes32' }],
    name: 'OrderIsCancelled',
    type: 'error',
  },
  {
    inputs: [{ name: 'orderHash', type: 'bytes32' }],
    name: 'OrderPartiallyFilled',
    type: 'error',
  },
  { inputs: [], name: 'PartialFillsNotEnabledForOrder', type: 'error' },
  {
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'identifier', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'TokenTransferGenericFailure',
    type: 'error',
  },
  {
    inputs: [
      { name: 'orderIndex', type: 'uint256' },
      { name: 'considerationIndex', type: 'uint256' },
    ],
    name: 'UnresolvedConsiderationCriteria',
    type: 'error',
  },
  {
    inputs: [
      { name: 'orderIndex', type: 'uint256' },
      { name: 'offerIndex', type: 'uint256' },
    ],
    name: 'UnresolvedOfferCriteria',
    type: 'error',
  },
  { inputs: [], name: 'UnusedItemParameters', type: 'error' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,

        name: 'newCounter',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'offerer',
        type: 'address',
      },
    ],
    name: 'CounterIncremented',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,

        name: 'orderHash',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'offerer',
        type: 'address',
      },
      { indexed: true, name: 'zone', type: 'address' },
    ],
    name: 'OrderCancelled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,

        name: 'orderHash',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'offerer',
        type: 'address',
      },
      { indexed: true, name: 'zone', type: 'address' },
      {
        indexed: false,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        components: [
          { name: 'itemType', type: 'uint8' },
          { name: 'token', type: 'address' },
          { name: 'identifier', type: 'uint256' },
          { name: 'amount', type: 'uint256' },
        ],
        indexed: false,
        internalType: 'structSpentItem[]',
        name: 'offer',
        type: 'tuple[]',
      },
      {
        components: [
          { name: 'itemType', type: 'uint8' },
          { name: 'token', type: 'address' },
          { name: 'identifier', type: 'uint256' },
          { name: 'amount', type: 'uint256' },
          {
            name: 'recipient',
            type: 'address',
          },
        ],
        indexed: false,
        internalType: 'structReceivedItem[]',
        name: 'consideration',
        type: 'tuple[]',
      },
    ],
    name: 'OrderFulfilled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,

        name: 'orderHash',
        type: 'bytes32',
      },
      {
        components: [
          { name: 'offerer', type: 'address' },
          { name: 'zone', type: 'address' },
          {
            components: [
              { name: 'itemType', type: 'uint8' },
              { name: 'token', type: 'address' },
              {
                name: 'identifierOrCriteria',
                type: 'uint256',
              },
              { name: 'startAmount', type: 'uint256' },
              { name: 'endAmount', type: 'uint256' },
            ],

            name: 'offer',
            type: 'tuple[]',
          },
          {
            components: [
              { name: 'itemType', type: 'uint8' },
              { name: 'token', type: 'address' },
              {
                name: 'identifierOrCriteria',
                type: 'uint256',
              },
              { name: 'startAmount', type: 'uint256' },
              { name: 'endAmount', type: 'uint256' },
              {
                name: 'recipient',
                type: 'address',
              },
            ],

            name: 'consideration',
            type: 'tuple[]',
          },
          { name: 'orderType', type: 'uint8' },
          { name: 'startTime', type: 'uint256' },
          { name: 'endTime', type: 'uint256' },
          { name: 'zoneHash', type: 'bytes32' },
          { name: 'salt', type: 'uint256' },
          { name: 'conduitKey', type: 'bytes32' },
          {
            name: 'totalOriginalConsiderationItems',
            type: 'uint256',
          },
        ],
        indexed: false,
        internalType: 'structOrderParameters',
        name: 'orderParameters',
        type: 'tuple',
      },
    ],
    name: 'OrderValidated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32[]',
        name: 'orderHashes',
        type: 'bytes32[]',
      },
    ],
    name: 'OrdersMatched',
    type: 'event',
  },
] as const

/**
 * WETH
 * https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
 */
export const wethAbi = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'guy', type: 'address' },
      { name: 'wad', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'src', type: 'address' },
      { name: 'dst', type: 'address' },
      { name: 'wad', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: 'wad', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'dst', type: 'address' },
      { name: 'wad', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'deposit',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: '', type: 'address' },
      { name: '', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  { payable: true, stateMutability: 'payable', type: 'fallback' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'src', type: 'address' },
      { indexed: true, name: 'guy', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'src', type: 'address' },
      { indexed: true, name: 'dst', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'dst', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' },
    ],
    name: 'Deposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'src', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' },
    ],
    name: 'Withdrawal',
    type: 'event',
  },
] as const

export const customSolidityErrorsAbi = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  { inputs: [], name: 'ApprovalCallerNotOwnerNorApproved', type: 'error' },
  { inputs: [], name: 'ApprovalQueryForNonexistentToken', type: 'error' },
] as const
