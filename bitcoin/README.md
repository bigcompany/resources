# bitcoin

for managing bitcoins

[best API documentation](https://en.bitcoin.it/wiki/Original_Bitcoin_client/API_calls_list)

## API

#### [properties](#bitcoin-properties)

  - [id](#bitcoin-properties-id)

  - [server](#bitcoin-properties-server)


#### [methods](#bitcoin-methods)

  - [connect](#bitcoin-methods-connect) (options, callback)

  - [connectId](#bitcoin-methods-connectId) (options, callback)

  - [addMultiSigAddress](#bitcoin-methods-addMultiSigAddress) ()

  - [addNode](#bitcoin-methods-addNode) ()

  - [backupWallet](#bitcoin-methods-backupWallet) ()

  - [createMultiSig](#bitcoin-methods-createMultiSig) ()

  - [createRawTransaction](#bitcoin-methods-createRawTransaction) ()

  - [decodeRawTransaction](#bitcoin-methods-decodeRawTransaction) ()

  - [dumpPrivKey](#bitcoin-methods-dumpPrivKey) ()

  - [encryptWallet](#bitcoin-methods-encryptWallet) ()

  - [getAccount](#bitcoin-methods-getAccount) ()

  - [getAccountAddress](#bitcoin-methods-getAccountAddress) ()

  - [getAddedNodeInfo](#bitcoin-methods-getAddedNodeInfo) ()

  - [getAddressesByAccount](#bitcoin-methods-getAddressesByAccount) ()

  - [getBalance](#bitcoin-methods-getBalance) ()

  - [getBlock](#bitcoin-methods-getBlock) ()

  - [getBlockCount](#bitcoin-methods-getBlockCount) ()

  - [getBlockHash](#bitcoin-methods-getBlockHash) ()

  - [getBlockTemplate](#bitcoin-methods-getBlockTemplate) ()

  - [getConnectionCount](#bitcoin-methods-getConnectionCount) ()

  - [getDifficulty](#bitcoin-methods-getDifficulty) ()

  - [getGenerate](#bitcoin-methods-getGenerate) ()

  - [getHashesPerSecond](#bitcoin-methods-getHashesPerSecond) ()

  - [getHashesPerSec](#bitcoin-methods-getHashesPerSec) ()

  - [getInfo](#bitcoin-methods-getInfo) ()

  - [getMiningInfo](#bitcoin-methods-getMiningInfo) ()

  - [getNewAddress](#bitcoin-methods-getNewAddress) ()

  - [getPeerInfo](#bitcoin-methods-getPeerInfo) ()

  - [getRawMemPool](#bitcoin-methods-getRawMemPool) ()

  - [getRawTransaction](#bitcoin-methods-getRawTransaction) ()

  - [getReceivedByAccount](#bitcoin-methods-getReceivedByAccount) ()

  - [getReceivedByAddress](#bitcoin-methods-getReceivedByAddress) ()

  - [getTransaction](#bitcoin-methods-getTransaction) ()

  - [getTxOut](#bitcoin-methods-getTxOut) ()

  - [getTxOutSetInfo](#bitcoin-methods-getTxOutSetInfo) ()

  - [getWork](#bitcoin-methods-getWork) ()

  - [help](#bitcoin-methods-help) ()

  - [importPrivKey](#bitcoin-methods-importPrivKey) ()

  - [keypoolRefill](#bitcoin-methods-keypoolRefill) ()

  - [keyPoolRefill](#bitcoin-methods-keyPoolRefill) ()

  - [listAccounts](#bitcoin-methods-listAccounts) ()

  - [listAddressGroupings](#bitcoin-methods-listAddressGroupings) ()

  - [listLockUnspent](#bitcoin-methods-listLockUnspent) ()

  - [listReceivedByAccount](#bitcoin-methods-listReceivedByAccount) ()

  - [listReceivedByAddress](#bitcoin-methods-listReceivedByAddress) ()

  - [listSinceBlock](#bitcoin-methods-listSinceBlock) ()

  - [listTransactions](#bitcoin-methods-listTransactions) ()

  - [listUnspent](#bitcoin-methods-listUnspent) ()

  - [lockUnspent](#bitcoin-methods-lockUnspent) ()

  - [move](#bitcoin-methods-move) ()

  - [sendFrom](#bitcoin-methods-sendFrom) ()

  - [sendMany](#bitcoin-methods-sendMany) ()

  - [sendRawTransaction](#bitcoin-methods-sendRawTransaction) ()

  - [sendToAddress](#bitcoin-methods-sendToAddress) ()

  - [setAccount](#bitcoin-methods-setAccount) ()

  - [setGenerate](#bitcoin-methods-setGenerate) ()

  - [setTxFee](#bitcoin-methods-setTxFee) ()

  - [signMessage](#bitcoin-methods-signMessage) ()

  - [signRawTransaction](#bitcoin-methods-signRawTransaction) ()

  - [stop](#bitcoin-methods-stop) ()

  - [submitBlock](#bitcoin-methods-submitBlock) ()

  - [validateAddress](#bitcoin-methods-validateAddress) ()

  - [verifyMessage](#bitcoin-methods-verifyMessage) ()

  - [walletLock](#bitcoin-methods-walletLock) ()

  - [walletPassphrase](#bitcoin-methods-walletPassphrase) ()

  - [walletPassphraseChange](#bitcoin-methods-walletPassphraseChange) ()

  - [start](#bitcoin-methods-start) ()

<a name="bitcoin-properties"></a>

## properties 
for managing bitcoins

- **id** 

  - **type** : any

- **server** 

  - **description** : a bitcoin server

  - **properties**

    - **host** 

      - **description** : the hostname of the bitcoin server

      - **type** : string

      - **default** : localhost

    - **port** 

      - **description** : the port of the bitcoin server

      - **type** : number

      - **default** : 8332

    - **user** 

      - **description** : the user of the bitcoin server

      - **type** : string

      - **default** : rpcuser

    - **pass** 

      - **description** : the password of the bitcoin server

      - **type** : string

      - **default** : rpcpassword

    - **ssl** 

      - **description** : whether to enable ssl on bitcoin server

      - **type** : boolean

      - **default** : false


<a name="bitcoin-methods"></a> 

## methods 

<a name="bitcoin-methods-connect"></a> 

### bitcoin.connect(options, callback)

connects to a bitcoin server

- **options** 

  - **type** : object

  - **properties**

    - **host** 

      - **description** : the hostname of the bitcoin server

      - **type** : string

      - **default** : localhost

    - **port** 

      - **description** : the port of the bitcoin server

      - **type** : number

      - **default** : 8332

    - **user** 

      - **description** : the user of the bitcoin server

      - **type** : string

      - **default** : rpcuser

    - **pass** 

      - **description** : the password of the bitcoin server

      - **type** : string

      - **default** : rpcpassword

    - **ssl** 

      - **description** : whether to enable ssl on bitcoin server

      - **type** : boolean

      - **default** : false

- **callback** 

  - **type** : function

<a name="bitcoin-methods-connectId"></a> 

### bitcoin.connectId(options)

converts connect info to connectId

- **options** 

  - **type** : object

  - **properties**

    - **host** 

      - **description** : the hostname of the bitcoin server

      - **type** : string

      - **default** : localhost

    - **port** 

      - **description** : the port of the bitcoin server

      - **type** : number

      - **default** : 8332

    - **user** 

      - **description** : the user of the bitcoin server

      - **type** : string

      - **default** : rpcuser

- **callback** 

  - **type** : function

<a name="bitcoin-methods-start"></a> 

### bitcoin.start()

<a name="bitcoin-methods-addMultiSigAddress"></a> 

### bitcoin.addMultiSigAddress()



<a name="bitcoin-methods-addNode"></a> 

### bitcoin.addNode()



<a name="bitcoin-methods-backupWallet"></a> 

### bitcoin.backupWallet()



<a name="bitcoin-methods-createMultiSig"></a> 

### bitcoin.createMultiSig()



<a name="bitcoin-methods-createRawTransaction"></a> 

### bitcoin.createRawTransaction()



<a name="bitcoin-methods-decodeRawTransaction"></a> 

### bitcoin.decodeRawTransaction()



<a name="bitcoin-methods-dumpPrivKey"></a> 

### bitcoin.dumpPrivKey()



<a name="bitcoin-methods-encryptWallet"></a> 

### bitcoin.encryptWallet()



<a name="bitcoin-methods-getAccount"></a> 

### bitcoin.getAccount()



<a name="bitcoin-methods-getAccountAddress"></a> 

### bitcoin.getAccountAddress()



<a name="bitcoin-methods-getAddedNodeInfo"></a> 

### bitcoin.getAddedNodeInfo()



<a name="bitcoin-methods-getAddressesByAccount"></a> 

### bitcoin.getAddressesByAccount()



<a name="bitcoin-methods-getBalance"></a> 

### bitcoin.getBalance()



<a name="bitcoin-methods-getBlock"></a> 

### bitcoin.getBlock()



<a name="bitcoin-methods-getBlockCount"></a> 

### bitcoin.getBlockCount()



<a name="bitcoin-methods-getBlockHash"></a> 

### bitcoin.getBlockHash()



<a name="bitcoin-methods-getBlockTemplate"></a> 

### bitcoin.getBlockTemplate()



<a name="bitcoin-methods-getConnectionCount"></a> 

### bitcoin.getConnectionCount()



<a name="bitcoin-methods-getDifficulty"></a> 

### bitcoin.getDifficulty()



<a name="bitcoin-methods-getGenerate"></a> 

### bitcoin.getGenerate()



<a name="bitcoin-methods-getHashesPerSecond"></a> 

### bitcoin.getHashesPerSecond()



<a name="bitcoin-methods-getHashesPerSec"></a> 

### bitcoin.getHashesPerSec()



<a name="bitcoin-methods-getInfo"></a> 

### bitcoin.getInfo()



<a name="bitcoin-methods-getMiningInfo"></a> 

### bitcoin.getMiningInfo()



<a name="bitcoin-methods-getNewAddress"></a> 

### bitcoin.getNewAddress()



<a name="bitcoin-methods-getPeerInfo"></a> 

### bitcoin.getPeerInfo()



<a name="bitcoin-methods-getRawMemPool"></a> 

### bitcoin.getRawMemPool()



<a name="bitcoin-methods-getRawTransaction"></a> 

### bitcoin.getRawTransaction()



<a name="bitcoin-methods-getReceivedByAccount"></a> 

### bitcoin.getReceivedByAccount()



<a name="bitcoin-methods-getReceivedByAddress"></a> 

### bitcoin.getReceivedByAddress()



<a name="bitcoin-methods-getTransaction"></a> 

### bitcoin.getTransaction()



<a name="bitcoin-methods-getTxOut"></a> 

### bitcoin.getTxOut()



<a name="bitcoin-methods-getTxOutSetInfo"></a> 

### bitcoin.getTxOutSetInfo()



<a name="bitcoin-methods-getWork"></a> 

### bitcoin.getWork()



<a name="bitcoin-methods-help"></a> 

### bitcoin.help()



<a name="bitcoin-methods-importPrivKey"></a> 

### bitcoin.importPrivKey()



<a name="bitcoin-methods-keypoolRefill"></a> 

### bitcoin.keypoolRefill()



<a name="bitcoin-methods-keyPoolRefill"></a> 

### bitcoin.keyPoolRefill()



<a name="bitcoin-methods-listAccounts"></a> 

### bitcoin.listAccounts()



<a name="bitcoin-methods-listAddressGroupings"></a> 

### bitcoin.listAddressGroupings()



<a name="bitcoin-methods-listLockUnspent"></a> 

### bitcoin.listLockUnspent()



<a name="bitcoin-methods-listReceivedByAccount"></a> 

### bitcoin.listReceivedByAccount()



<a name="bitcoin-methods-listReceivedByAddress"></a> 

### bitcoin.listReceivedByAddress()



<a name="bitcoin-methods-listSinceBlock"></a> 

### bitcoin.listSinceBlock()



<a name="bitcoin-methods-listTransactions"></a> 

### bitcoin.listTransactions()



<a name="bitcoin-methods-listUnspent"></a> 

### bitcoin.listUnspent()



<a name="bitcoin-methods-lockUnspent"></a> 

### bitcoin.lockUnspent()



<a name="bitcoin-methods-move"></a> 

### bitcoin.move()



<a name="bitcoin-methods-sendFrom"></a> 

### bitcoin.sendFrom()



<a name="bitcoin-methods-sendMany"></a> 

### bitcoin.sendMany()



<a name="bitcoin-methods-sendRawTransaction"></a> 

### bitcoin.sendRawTransaction()



<a name="bitcoin-methods-sendToAddress"></a> 

### bitcoin.sendToAddress()



<a name="bitcoin-methods-setAccount"></a> 

### bitcoin.setAccount()



<a name="bitcoin-methods-setGenerate"></a> 

### bitcoin.setGenerate()



<a name="bitcoin-methods-setTxFee"></a> 

### bitcoin.setTxFee()



<a name="bitcoin-methods-signMessage"></a> 

### bitcoin.signMessage()



<a name="bitcoin-methods-signRawTransaction"></a> 

### bitcoin.signRawTransaction()



<a name="bitcoin-methods-stop"></a> 

### bitcoin.stop()



<a name="bitcoin-methods-submitBlock"></a> 

### bitcoin.submitBlock()



<a name="bitcoin-methods-validateAddress"></a> 

### bitcoin.validateAddress()



<a name="bitcoin-methods-verifyMessage"></a> 

### bitcoin.verifyMessage()



<a name="bitcoin-methods-walletLock"></a> 

### bitcoin.walletLock()



<a name="bitcoin-methods-walletPassphrase"></a> 

### bitcoin.walletPassphrase()



<a name="bitcoin-methods-walletPassphraseChange"></a> 

### bitcoin.walletPassphraseChange()





*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*
