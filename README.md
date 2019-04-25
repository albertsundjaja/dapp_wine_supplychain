# Demo Project - Wine Supply Chain Dapp

## UML

Below is the original UML diagrams for the project. During the project some changes have been made, the changes are noted in each of the diagram section.

### Activity Diagram

![activity](rsc/activity.jpg)

### Sequence Diagram

![sequence](rsc/sequence.jpg)

### State Diagram

After consideration, during buying from brewer and distributor, it is impractical to use Ether to pay. As such, the requirement `isPaidEnough` is removed from both the brewer and distributor.

Everyone can also be a consumer, anyone should be able to buy the end product. As such, the restriction of `isConsumer` is removed.

##### Original

![state](rsc/state.jpg)

##### After Modification

![state](rsc/state_2.jpg)

### Class Diagram

After consideration, it might seem that the Core contract is redundant as it only contains inheritance from OpenZeppelin Secondary, Pausable and Ownable. As we also need the function `onlyOwner` in the AccessControl, the inheritance is done in the AccessControl.

Instead of separate contract, `members` and `grapes` mapping are implemented to keep track of roles and grapes.

```
AccessControl is Ownable, Pausable, Secondary
Base is AccessControl
```

##### Original

![class](rsc/classes.jpg)

##### After Modification

![class](rsc/classes2.jpg)

## Frameworks and Tools 

```
Truffle v5.0.13 (core: 5.0.13)
Solidity - 0.5.2 (solc-js)
Node v8.10.0
Web3.js v1.0.0-beta.37
openzeppelin-solidity ^2.2.0
```
## Restrictions on Functionality

1. Only owner can add roles (however, for the purpose of testing, another function is created so anyone can add role)
2. 1 address can only have 1 role

## Installation

1. Download/clone this repo

``
