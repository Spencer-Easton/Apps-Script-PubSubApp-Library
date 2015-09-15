function doPost(e) {
  var postBody = JSON.parse(e.postData.getDataAsString());
  var messageData = Utilities.newBlob(Utilities.base64Decode(postBody.message.data)).getDataAsString();
  Utilities.sleep(10000);
  var ss = SpreadsheetApp.openById('1DGHH-j8MaHx1UijIxHZcffLpMG_NDkf_LsGKL0GVWR8').getSheetByName("Log");
  ss.appendRow([new Date(), messageData, JSON.stringify(postBody,undefined,2)])
  return 200;
}
