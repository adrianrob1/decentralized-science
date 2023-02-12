pragma solidity >=0.8.0 <0.9.0;

contract DeSciContract {

    mapping (address => uint) public userReputations;
    mapping (string => address) public paperAuthors;
    mapping (string => uint) public paperReputations;
    mapping (address => uint) public userPaperCount;
    mapping (address => string) public userPapersRepo;

    event PaperAdded(address addrAuthor, string ipfsCid);
    event UserReputation(address addrUser, uint reputation);
    event PaperReputation(string ipfsCid, uint reputation);
    event PaperCount(address addrUser, uint count);
    event UserRepository(address addrUser, string papersRepo);

    function getUserReputation() public {
        emit UserReputation(msg.sender, userReputations[msg.sender]);
    }

    function getPaperCount() public {
        emit PaperCount(msg.sender, userPaperCount[msg.sender]);
    }

    function getPaperReputation(string calldata ipfsCid) public {
        emit PaperReputation(ipfsCid, paperReputations[ipfsCid]);
    }

    function increaseReputation(address addr) private {
        userReputations[addr] += 1;
    }

    function decreaseReputation(address addr) private {
        userReputations[addr] -= 1;
    }

    function getUserReputationAndPaperCount() public {
        emit UserReputation(msg.sender, userReputations[msg.sender]);
        emit PaperCount(msg.sender, userPaperCount[msg.sender]);
    }

    function increasePaperReputation(string calldata ipfsCid) public {
        // TODO: check if the user is the author of the paper
        paperReputations[ipfsCid] += 1;
        emit PaperReputation(ipfsCid, paperReputations[ipfsCid]);
    }

    function decreasePaperReputation(string calldata ipfsCid) public {
        // TODO: check if the user is the author of the paper
        paperReputations[ipfsCid] -= 1;
        emit PaperReputation(ipfsCid, paperReputations[ipfsCid]);
    }

    function getUserPapersRepo() public {
        emit UserRepository(msg.sender, userPapersRepo[msg.sender]);
    }

    function addPaper(string calldata paperCid, string calldata repoCid) public {
        // use the hash of the ipfsCid as the paper address
        // use the reputation of the author as the paper reputation
        paperReputations[paperCid] = userReputations[msg.sender];
        userPapersRepo[msg.sender] = repoCid;

        // hash ipfsCid to get the paper address
        paperAuthors[paperCid] = msg.sender;

        userReputations[msg.sender] += 1;
        userPaperCount[msg.sender] += 1;

        emit PaperAdded(msg.sender, paperCid);
        emit UserReputation(msg.sender, userReputations[msg.sender]);
        
    }
}