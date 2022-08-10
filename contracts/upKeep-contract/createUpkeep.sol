// pragma solidity >=0.7.0 <0.9.0;

// import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

// interface ILinkToken {
//     function transferAndCall(address receiver, uint amount, bytes calldata data) external returns (bool success);
//     function balanceOf(address user) external view returns(uint);
//     function approve(address spender, uint amount) external;
//     function transfer(address _to, uint _amount) external;
// }

// interface KeepersRegistry {
//     function getRegistrar() external view returns(address);
// }

// contract UpkeepCreator {
//     address public REGISTRY_ADDRESS = 0x02777053d6764996e594c3E88AF1D58D5363a2e6;//0x4Cb093f226983713164A62138C3F718A5b595F73; //Kovan testnet 
//     address public ERC677_LINK_ADDRESS = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709;// 0xa36085F69e2889c224210F603D836748e7dC0088; //Kovan testnet (LINK addresses: https://docs.chain.link/docs/link-token-contracts/)
//     /*
//     register(
//         string memory name,
//         bytes calldata encryptedEmail,
//         address upkeepContract,
//         uint32 gasLimit,
//         address adminAddress,
//         bytes calldata checkData,
//         uint96 amount,
//         uint8 source
//     )
//     */

//     // constructor (address _registry, address _linkAddress)  {
//     //    REGISTRY_ADDRESS = _registry;
//     //    ERC677_LINK_ADDRESS = _linkAddress;
//     // }
//     bytes4 private constant FUNC_SELECTOR = bytes4(keccak256("register(string,bytes,address,uint32,address,bytes,uint96,uint8)"));
//     uint public minFundingAmount = 5000000000000000000; //5 LINK
//     uint8 public SOURCE = 110;

//     ILinkToken ERC677Link = ILinkToken(ERC677_LINK_ADDRESS);

//     //Note: make sure to fund this contract with LINK before calling createUpkeep
//     function createUpkeep(address contractAddressToAutomate, string memory upkeepName, uint32 gasLimit) external {
//         address registarAddress = KeepersRegistry(REGISTRY_ADDRESS).getRegistrar();
//         uint96 amount = uint96(minFundingAmount);
//         bytes memory data = abi.encodeWithSelector(FUNC_SELECTOR, upkeepName, hex"", contractAddressToAutomate, gasLimit, msg.sender, hex"", amount, SOURCE);
//         ERC677Link.transferAndCall(registarAddress, minFundingAmount, data);
//     }

// }
//  function cancelUpkeepById(uint256 id) external {
//     IKeepersRegistry(REGISTRY_ADDRESS).cancelUpkeep(id);

//   }

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

// UpkeepIDConsumerExample.sol imports functions from both ./KeeperRegistryInterface.sol and
// ./interfaces/LinkTokenInterface.sol

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

import {KeeperRegistryInterface, State, Config} from "@chainlink/contracts/src/v0.8/interfaces/KeeperRegistryInterface.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

interface KeeperRegistrarInterface {
  function register(
    string memory name,
    bytes calldata encryptedEmail,
    address upkeepContract,
    uint32 gasLimit,
    address adminAddress,
    bytes calldata checkData,
    uint96 amount,
    uint8 source,
    address sender
  ) external;
}

contract UpkeepIDConsumer {
  LinkTokenInterface public immutable i_link;
  address public immutable registrar;
  KeeperRegistryInterface public immutable i_registry;
  bytes4 registerSig = KeeperRegistrarInterface.register.selector;

  bytes public bytesAre;
  event UpkeepID(uint256 upkeepid);

  constructor(
    // LinkTokenInterface _link,
    address _linkToken,
    address _registrar
    
  ) {
    i_link = LinkTokenInterface(_linkToken);
    registrar = _registrar;
    i_registry = KeeperRegistryInterface(_registrar);
  }

  function registerAndPredictID(
    string memory name,
    bytes calldata encryptedEmail,
    address upkeepContract,
    uint32 gasLimit,
    address adminAddress,
    bytes calldata checkData,
    uint96 amount,
    uint8 source,
    address sender
  ) public {
    (State memory state, Config memory _c, address[] memory _k) = i_registry.getState();
    uint256 oldNonce = state.nonce;

    bytes memory payload = abi.encode(
      name,
      encryptedEmail,
      upkeepContract,
      gasLimit,
      adminAddress,
      checkData,
      amount,
      source,
      sender
    );

    i_link.transferAndCall(registrar, amount, bytes.concat(registerSig, payload));
    (state, _c, _k) = i_registry.getState();
    uint256 newNonce = state.nonce;
    if (newNonce == oldNonce + 1) {
      uint256 upkeepID = uint256(
        keccak256(abi.encodePacked(blockhash(block.number - 1), address(i_registry), uint32(oldNonce)))
      );
      emit UpkeepID(upkeepID);
      
    } else {
      revert("auto-approve disabled");
    }
  }
}

