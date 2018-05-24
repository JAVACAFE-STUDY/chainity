# Community rewards

This is a platform that rewards members with tokens based on community activity. And Members are allowed to spend their tokens for membership fee.
So it encourages members of your community to fully participate by giving reward and improve the success of your community.

## Getting Started

This is a dApp based on Ethreum block chain. So you need to join a network of Ethereum before running.

### Prerequisites

Install Geth
```
wget https://gethstore.blob.core.windows.net/builds/geth-darwin-amd64-1.8.8-2688dab4.tar.gz
tar -xf geth-darwin-amd64-1.8.8-2688dab4.tar.gz
```

Start Geth
```
geth-darwin-amd64-1.8.8-2688dab4/geth --rpc --rinkeby
```

Install MongoDB
```
wget https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-3.6.4.tgz
tar -xf mongodb-osx-ssl-x86_64-3.6.4.tgz
mkdir [YOUR_DATA_PATH]
```

Start MongoDB
```
mongodb-osx-x86_64-3.6.4/bin/mongod --dbpath [YOUR_DATA_PATH]
```

### Installing

Clone the repo
```
git clone git@github.com:JAVACAFE-STUDY/community-rewards.git
cd community-rewards
```

Install dependencies
```
npm install
npm install --prefix backend/
npm install --prefix frontend/
```

Set environment (vars)
```
cp .env.example backend/.env
```

Start server
```
npm start
```

## Contributing

Contributions, questions and comments are all welcome and encouraged. For code contributions submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Support Development

If this project saved your valuable time in getting your service up, and you feel like buying me coffee, you can donate either at my ETH address: 7cef57fd7faa78c4132e7c748115528e187042a4