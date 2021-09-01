 const createTableArrayFunction = (queryData, myJsonData, chainId) => {
    const tableRows = [];
    queryData.pools.forEach(({ id, tokens, totalLiquidity}) => {
      //TODO: Fix manual iteration, change through config and make it dynamic -> dependent on Table Head Cells
      let maticAmount = 0
      let balAmount = 0
      let qiAmount = 0
      let mtaAmount = 0
      if (myJsonData.pools[id.toString()]) {
      myJsonData.pools[id.toString()].forEach((element) => {
        if(element.tokenAddress === maticId) {
          maticAmount = element.amount
        }
        else if (element.tokenAddress === balId) {
          balAmount = element.amount
        } 
        else if (element.tokenAddress === mtaId) {
          mtaAmount = element.amount
        }
        else if (element.tokenAddress === qiId) {
          qiAmount = element.amount
        }
      });
      const tableEntry = createData(
        tokens.map(e => e.symbol).join('/'),
        balancerUrl.concat(id),
        Number(totalLiquidity),
        balAmount,
        maticAmount,
        qiAmount,
        mtaAmount
      )
      tableRows.push(tableEntry);
    }
    });
    return tableRows;
  };