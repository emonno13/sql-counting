function downloadCSV(array, csvName = 'download.csv')
{
    let csv = Papa.unparse(
      {
        fields: ['DBO','Quantity'],
        data: array
      },
      {
          quotes: true,
          delimiter: ',',
          newline: '\n',
      }
    );
    let csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    let csvURL =  null;
    if (navigator.msSaveBlob)
    {
        csvURL = navigator.msSaveBlob(csvData, csvName);
    }
    else
    {
        csvURL = window.URL.createObjectURL(csvData);
    }

    let tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', csvName);
    tempLink.click();
}

document.getElementById('file').onchange = async function(){

    let file = this.files[0];

     

    let reader = new FileReader();
    reader.onload = function(progressEvent){
    // Entire file
    //   console.log(this.result);
    let allCount = 0
    let realCount = 0
    let count = 0
    let preDBO = 'unknown'
    let arr = []
      // By lines
      let lines = this.result.split('\n');


      for(let line = 0; line < lines.length; line++){
        let row = lines[line].trim().toLocaleLowerCase();

        if(row.includes('create procedure')){
            if(count > 0){
              console.log('%c'+count,"background: red; color: yellow; font-size: 25px");
              arr.push([preDBO,count])
            }
            console.log(lines[line].trim().replace(/create procedure|[\(]/gi,''));
            count = 0;
            preDBO = lines[line].trim().replace(/create procedure|[\(]/gi,'');
        }
        if(!/^--/g.test(row)){
          allCount+=(row.match(/getdate\([^)]*\)/g) || []).length
          count += (row.match(/getdate\([^)]*\)/g) || []).length
        }
        realCount+=(row.match(/getdate\([^)]*\)/g) || []).length
      }

      console.log('%c'+count,"background: red; color: yellow; font-size: 25px");
      console.log('all count:', allCount);
      console.log('real count:', realCount);
      arr.push([preDBO,count])
      downloadCSV(arr, file.name +'.csv')
    };
    reader.onerror = (event) => {
      alert(event.target.error.name);
    };
    reader.readAsText(file);
  };