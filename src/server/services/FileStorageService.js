const Cloud = require('@google-cloud/storage')
const path = require('path')
const keyFilename = path.join(__dirname, '../config/filestoragekey.json')
const { GCLOUD } = require('../../config/filestorage')

const storage = new Cloud.Storage({
  keyFilename: keyFilename,
  projectId: GCLOUD.projectId,
})

const bucket = storage.bucket(GCLOUD.bucket_name)

const uploadFile = (file, name) => {
  if(!file || !name)
    return

  return new Promise((resolve, reject) => {
    const buffer = file.data
    const blob = bucket.file(name.replace(/ /g, "_"))
    const blobStream = blob.createWriteStream({
      resumable: false
    })
  
    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      resolve(publicUrl)
    })
    .on('error', () => {
      reject('Unable to upload fle.')
    })
    .end(buffer)
  })
}

const downloadFile = (filename) => {
  if (!filename)
    return

  return new Promise((resolve, reject) => {
    const file = bucket.file(filename);

    file.download((err, contents) => {
        if(err)
          reject(err)
        resolve(contents)
    })
  })
}

const deleteFile = (filename) => {
  if (!filename)
    return

  return new Promise(async (resolve, reject) => {
    const file = bucket.file(filename);

    try {
      await file.delete();
    } catch(deleteErr) {}
    resolve({});
  })
}

module.exports = {
  uploadFile,
  downloadFile,
  deleteFile
}