/*
   Copyright (c) 2015 Spencer Easton
   
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

function doPost(e) {
  var postBody = JSON.parse(e.postData.getDataAsString());
  var messageData = Utilities.newBlob(Utilities.base64Decode(postBody.message.data)).getDataAsString();
  Utilities.sleep(10000);
  var ss = SpreadsheetApp.openById('1DGHH-j8MaHx1UijIxHZcffLpMG_NDkf_LsGKL0GVWR8').getSheetByName("Log");
  ss.appendRow([new Date(), messageData, JSON.stringify(postBody,undefined,2)])
  return 200;
}
