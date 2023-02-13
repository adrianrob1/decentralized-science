pragma solidity >=0.8.0 <0.9.0;

contract DeSciContract {

    struct Review {
        address reviewer;
        bool isPositive;
    }

    // ----------------- DATA -----------------

    mapping (address => uint) public userPaperCount;
    mapping (address => int) public userReputations;
    mapping (address => string) public userPapersRepo;

    mapping (string => int) public paperReputations;
    mapping (string => address) public paperAuthors;
    
    // we have a directory with a metadata file for each paper
    string public papersInfoCid;

    // inside we have a directory for each paper with the reviews
    // the directory is named after the paper ipfsCid
    string public papersReviewsCid;

    event PaperAdded(address addrAuthor, string ipfsCid);
    event UserReputation(address addrUser, int reputation);
    event PaperReputation(string ipfsCid, int reputation);
    event PaperCount(address addrUser, uint count);
    event UserRepository(address addrUser, string papersRepo);
    event PapersInfo(string papersInfoCid);
    event PapersReviews(string papersReviewsCid);
    event PaperReviewer(string paperCid, address reviewer);
    event PaperAuthor(string paperCid, address author);

    // ----------------- METHODS -----------------

    function addPaper(string calldata paperCid, string calldata repoCid, string calldata papersInfoDirCid) public {
        // use the hash of the ipfsCid as the paper address
        // use the reputation of the author as the paper reputation
        paperReputations[paperCid] = int256(userReputations[msg.sender]);
        userPapersRepo[msg.sender] = repoCid;

        // hash ipfsCid to get the paper address
        paperAuthors[paperCid] = msg.sender;

        userReputations[msg.sender] += 1;
        userPaperCount[msg.sender] += 1;

        // update the papers info cid
        papersInfoCid = papersInfoDirCid;

        emit PaperAdded(msg.sender, paperCid);
        emit UserRepository(msg.sender, userPapersRepo[msg.sender]);
        emit UserReputation(msg.sender, userReputations[msg.sender]);
        emit PaperReputation(paperCid, paperReputations[paperCid]);
        emit PaperCount(msg.sender, userPaperCount[msg.sender]);
        emit PapersInfo(papersInfoCid);
    }

    function addReview(string calldata paperCid, string calldata reviewsCid, bool isPositive) public {
        // TODO: check if the user has already reviewed the paper
        // TODO: check if the user is the author of the paper

        // get reputation of the reviewer
        int reputation = userReputations[msg.sender];

        if(isPositive) {
            // increase the paper reputation
            paperReputations[paperCid] += reputation;

            // increase the reputation of the author
            userReputations[paperAuthors[paperCid]] += 1;
        } else {
            // decrease the paper reputation
            paperReputations[paperCid] -= reputation;

            // decrease the reputation of the author
            userReputations[paperAuthors[paperCid]] -= 1;
        }

        // update the paper reviews cid
        papersReviewsCid = reviewsCid;

        emit PaperReviewer(paperCid, msg.sender);
        emit PapersReviews(papersReviewsCid);
        emit UserReputation(paperAuthors[paperCid], userReputations[paperAuthors[paperCid]]);
        emit PaperReputation(paperCid, paperReputations[paperCid]);
    }


    // ----------------- GETTERS -----------------

    function getUserReputation() public {
        emit UserReputation(msg.sender, userReputations[msg.sender]);
    }

    function getPaperCount() public {
        emit PaperCount(msg.sender, userPaperCount[msg.sender]);
    }

    function getPaperReputation(string calldata ipfsCid) public {
        emit PaperReputation(ipfsCid, paperReputations[ipfsCid]);
    }

    function getUserReputationAndPaperCount() public {
        emit UserReputation(msg.sender, userReputations[msg.sender]);
        emit PaperCount(msg.sender, userPaperCount[msg.sender]);
    }

    function getUserPapersRepo() public {
        emit UserRepository(msg.sender, userPapersRepo[msg.sender]);
    }

    function getPapersInfo() public {
        emit PapersInfo(papersInfoCid);
    }

    function getPapersReviews() public {
        emit PapersReviews(papersReviewsCid);
    }

    function getPasperAuthor(string calldata ipfsCid) public {
        emit PaperAuthor(ipfsCid, paperAuthors[ipfsCid]);
    }
}