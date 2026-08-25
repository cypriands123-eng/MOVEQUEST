// MOVEQUEST Video Upload Handler
// Deploy this as a Web App with:
// - Execute as: Me
// - Who has access: Anyone

function getOrCreateFolder(parentFolder, folderName) {
  var folders = parentFolder.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return parentFolder.createFolder(folderName);
}

function doPost(e) {
  try {
    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);
    var fileName = data.fileName;
    var fileData = data.fileData; // Base64 encoded
    var mimeType = data.mimeType;
    var userId = data.userId;
    var userName = data.userName;
    var userEmail = data.userEmail;
    var cardNumber = data.cardNumber;

    // Create folder structure: MOVEQUEST Video Uploads > Student Email > Submission Folder
    var rootFolder = getOrCreateFolder(DriveApp.getRootFolder(), "MOVEQUEST Video Uploads");
    var studentFolder = getOrCreateFolder(rootFolder, userEmail);
    
    // Create submission folder name based on card number
    var submissionFolderName = "ARSC Animation Song Part " + cardNumber;
    var submissionFolder = getOrCreateFolder(studentFolder, submissionFolderName);

    // Decode base64 to blob
    var blob = Utilities.newBlob(Utilities.base64Decode(fileData), mimeType, fileName);

    // Save to Google Drive
    var file = submissionFolder.createFile(blob);
    file.setDescription("Uploaded by: " + userName + " (" + userId + ") | Video Part: " + cardNumber);

    // Make file viewable (optional - remove if you want private files)
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      fileId: file.getId(),
      fileUrl: file.getUrl(),
      fileName: file.getName()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var params = e.parameter;

  // If email and cardNumber are provided, look up the file
  if (params.email && params.cardNumber) {
    try {
      var rootFolder = getOrCreateFolder(DriveApp.getRootFolder(), "MOVEQUEST Video Uploads");
      var studentFolder = getOrCreateFolder(rootFolder, params.email);
      var submissionFolderName = "ARSC Animation Song Part " + params.cardNumber;
      var submissionFolder = getOrCreateFolder(studentFolder, submissionFolderName);

      var files = submissionFolder.getFiles();
      var latestFile = null;
      var latestDate = null;

      while (files.hasNext()) {
        var f = files.next();
        var date = f.getDateCreated();
        if (!latestDate || date > latestDate) {
          latestDate = date;
          latestFile = f;
        }
      }

      if (latestFile) {
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          fileId: latestFile.getId(),
          fileUrl: latestFile.getUrl(),
          fileName: latestFile.getName()
        })).setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: "No file found"
        })).setMimeType(ContentService.MimeType.JSON);
      }
    } catch (error) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: "MOVEQUEST Video Upload API is running"
  })).setMimeType(ContentService.MimeType.JSON);
}
