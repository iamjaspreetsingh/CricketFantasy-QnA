
async function main(){

    const [caller]=await ethers.getSigners();
    console.log('caller acct: '+caller.address);
    
    const sfAddress="0x653316e3710c9117A68e5cb996a83Aa3874aC929";
    
    // sd token address: 0x37841bf931C2c23FacD866B51dDa14b6c0330C65
    // SportsFantasy address: 0x653316e3710c9117A68e5cb996a83Aa3874aC929
    // manager address: 0x397B73151D8Ee4D4B66741E49744ed1BDAB95fe9

    SF=await ethers.getContractFactory('SportsFantasy');

    const sports = await SF.attach(sfAddress);
    owner = await sports.manager();
    console.log("Owner is", owner.toString());
    var qid=2417771;

    // await sports.setAdmins([caller.address]);

    // await sports.vote(qid, 1, "Jas");
    // await sports.submitRightSolution(qid, 1, "test","testr");
    await sports.getQidWinning(qid, owner);

    ques= await sports.getQcontent(qid)
    console.log(ques);


    bal5=await sports.balanceOf(owner);
    console.log(`bal5: ${bal5}`);   

}

main().then(()=>process.exit(0))
.catch(err=>{  
    console.error(err);
    process.exit(1);
})