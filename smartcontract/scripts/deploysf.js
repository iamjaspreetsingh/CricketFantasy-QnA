

async function main(){

    // const initialURI = 'https://token-cdn-domain/{id}.json';

    const [deployer]=await ethers.getSigners();
    console.log('deploy by acct: '+deployer.address);
    
    const bal=await deployer.getBalance();
    console.log('bal: '+bal);
    
    SDTtoken=await ethers.getContractFactory('ERC20SD');
    // stoken = await upgrades.deployProxy(SDTtoken, [ 'SportsFantasy','SD'], { initializer: 'initialize' });
    // await stoken.deployed();
    var stoken = await SDTtoken.deploy('SportsFantasy','SD');
    console.log(`sd token address: ${stoken.address}`);
    
    SportsFantasy=await ethers.getContractFactory('SportsFantasy');
    // sports = await SportsFantasy.deploy(deployer.address,stoken.address);
    const SDAddress=stoken.address;//"0x3099ff0081E2428b996819CC0D311A2A5F91D0fA";
    
    // sports = await SportsFantasy.deploy(deployer.address,SDAddress);
    
    sports = await upgrades.deployProxy(SportsFantasy, [ deployer.address,SDAddress], { initializer: 'initialize' });
    await sports.deployed();

    // sports = await upgrades.upgradeProxy("0xe333d95Cebd079409E36d60910a8f4C5d3Dc5786", SportsFantasy);
    // console.log("SportsFantasy contract upgraded");
  
    console.log(`SportsFantasy address: ${sports.address}`);
    
    // Token=await ethers.getContractFactory('ERC20SD');

    // const stoken = await Token.attach(SDAddress);

    owner=await sports.manager();
    console.log(`manager address: ${owner}`);   

    await sports.setAdmins([deployer.address, "0xaF7eBf3480b5684e4F40AE435074c09e6dc0d2A9","0x0A2242b3406dC378EA5E9bA1C1a0F7C220152F6d","0x8517E3aAe159965068219E523026B91D8aCaeb1f","0x81Ef2DcFc18D55d68D83c54937Ca30a76A05624C"])
    var admins=await sports.getAdmins();
    console.log(admins);


    await stoken.approve(sports.address,'10000000000000000000000');

    var bal2=await stoken.balanceOf(owner);
    
    console.log(`bal2: ${bal2}`);   

    var qid=1;

  
    bal3=await stoken.balanceOf(owner);
    console.log(`bal3: ${bal3}`);   


    await sports.postQuestion(qid, "ques", 1, 6, 1, "jas");
    await sports.vote(qid, 0, "Jas");
    await sports.vote(qid, 1, "Jas");

    bal4=await stoken.balanceOf(owner);
    console.log(`bal4: ${bal4}`);   

    await sports.submitRightSolution(qid, 0, "test","testr");
    await sports.getQidWinning(qid, owner);


    bal5=await stoken.balanceOf(owner);
    console.log(`bal5: ${bal5}`);   



}

main().then(()=>process.exit(0))
.catch(err=>{  
    console.error(err);
    process.exit(1);
})