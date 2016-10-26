var fs=require('fs');
var lineReader = require('readline').createInterface({
   input : fs.createReadStream('../csv/FoodFacts.csv') 
});
var i=0;
var lineRecords=[];
var isHeader = 0;
var countryIndex=0,fatIndex=0,protienIndex=0,carboIndex=0,saltIndex=0,sugarIndex=0;
var countryArray = ['Netherlands', 'Canada', 'United Kingdom' , 'United States' , 'Australia' , 'France' , 'Germany' , 'Spain', 'South Africa'];
var sugarArray = [];
var saltArray = [];
var jsonArray = [];
var count=[];
var north = ['United Kingdom', 'Denmark', 'Sweden','Norway'];
var central  = ['France', 'Belgium', 'Germany', 'Switzerland','Netherlands'];
var South = ['Portugal', 'Greece', 'Italy', 'Spain', 'Croatia','Albania'];
var nfatData =0,nprotienData=0,ncarboData =0,cfatData =0,cprotienData =0,ccarboData =0;
var sfatData =0,sprotienData=0,scarboData=0;
var jsonArray = [];
var Europe=[];
var nobj={},cobj={},sobj={};
var sCounter=0,cCounter=0,nCounter=0;
for(var i=0;i<countryArray.length;i++)  // initialise array
{
  sugarArray[i]=0;
  saltArray[i]=0;
  count[i]=0;
}

lineReader.on('line',function(line)
{
    lineRecords = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);   // split data  line by line 
    if(isHeader==0)           // it is for fetching index of coloumn
    {
        countryIndex = lineRecords.indexOf("countries_en");
        protienIndex = lineRecords.indexOf("proteins_100g");
        carboIndex = lineRecords.indexOf("carbohydrates_100g");
        fatIndex = lineRecords.indexOf("fat_100g"); 
        saltIndex = lineRecords.indexOf("salt_100g");
   sugarIndex = lineRecords.indexOf("sugars_100g");
   isHeader++;
    
    }   
    else
    {
        if( countryArray.includes(lineRecords[countryIndex]))    //it is for fetching all data
         {
   var index = countryArray.indexOf(lineRecords[countryIndex]);
   var salt = lineRecords[saltIndex].replace("",0);
   var sugar=lineRecords[sugarIndex].replace("",0);
   saltArray[index] = saltArray[index]+parseFloat(salt);
   sugarArray[index] = sugarArray[index]+parseFloat(sugar);
   count[index]+=1;
         }
        if(north.includes(lineRecords[countryIndex])) // it is for checking north countries
         {
        var nfat = lineRecords[fatIndex].replace("",0);
        nprotien=lineRecords[protienIndex].replace("",0);
        ncarbo=lineRecords[carboIndex].replace("",0);
        nfatData+=parseFloat(nfat);
        ncarboData+=parseFloat(ncarbo);
        nprotienData+=parseFloat(nprotien);
        nCounter++;
         }
    if(central.includes(lineRecords[countryIndex]))  // it is for checking central countries
         {
        var cfat = lineRecords[fatIndex].replace("",0);
        var cprotien=lineRecords[protienIndex].replace("",0);
        var ccarbo=lineRecords[carboIndex].replace("",0);
        cfatData+=parseFloat(cfat);
        cprotienData+=parseFloat(cprotien);
        ccarboData+=parseFloat(ccarbo);
        cCounter++;
         }
    if(South.includes(lineRecords[countryIndex]))   // it is for checking south countries
         {
        var sfat = lineRecords[fatIndex].replace("",0);
        var sprotien=lineRecords[protienIndex].replace("",0);
        var scarbo=lineRecords[carboIndex].replace("",0);
        sfatData+=parseFloat(sfat);
        sprotienData+=parseFloat(sprotien);
        scarboData+=parseFloat(scarbo);
        sCounter++;  
         }
       }
 });
 
lineReader.on('close',function ()       //put data into object

{ 
     for(var j=0;j<countryArray.length;j++)  //put data into object
  {
    var obj = {};
    obj["country"] = countryArray[j];
    obj["salt"] = saltArray[j]/count[i];
    obj["sugar"] = sugarArray[j]/count[i];
    jsonArray.push(obj);
  }
  fs.writeFile('../json/barGraph.json', JSON.stringify(jsonArray) , 'utf-8');
    nobj["regions"] = "NorthEurope";
    nobj["Fat"] = nfatData/nCounter;
    nobj["Protien"] = nprotienData/nCounter;
    nobj["carbohydrates"] = ncarboData/nCounter;
    Europe.push(nobj);
    cobj["regions"] = "CentralEurope";
    cobj["Fat"] = cfatData/cCounter;
    cobj["Protien"] = cprotienData/cCounter;
    cobj["carbohydrates"] = ccarboData/cCounter;
    Europe.push(cobj);
    sobj["regions"] = "SouthEurope";
    sobj["Fat"] = sfatData/sCounter;
    sobj["Protien"] = sprotienData/sCounter;
    sobj["carbohydrates"] = scarboData/sCounter;
    Europe.push(sobj);
    fs.writeFile('../json/multiLine.json',JSON.stringify(Europe),'utf-8');
});
