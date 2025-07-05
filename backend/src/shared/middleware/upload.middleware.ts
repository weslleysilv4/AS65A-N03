import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('text/csv')) {
      cb(null, true);
    } else {
      cb(
        new Error('Arquivo não suportado. Apenas arquivos CSV são permitidos.')
      );
    }
  },
});

export default upload;
