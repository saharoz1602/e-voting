# Getting Started

# Setup Contracts

## install node_modules in contracts folder

```bash

cd contracts
npm install

```

## start hardhat node

```bash

npm run node
```

## deploy contract

remove `deployments` folder from `contracts/ignition` and run following command. before running this command make sure to start hardhat node

```bash

npm run deploy:dev
```

## Setup frontend

## install node_modules in root folder

```bash

npm install

```

### Config contract address in ui

copy the contract address provided in deployment step and replace it with the existing address in `/src/configs/contractConfigs.js`

```javascript
import Evoting_ABI from "@/src/assets/abis/Evoting.json";

// change this address to newly created contract's
const Evoting_Address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export { Evoting_ABI, Evoting_Address };
```

# start fontend server

```bash
npm start

```
# e-voting
