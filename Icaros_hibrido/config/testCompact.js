const ffmpeg = require('fluent-ffmpeg');

ffmpeg('../uploads/Icaros - Brave 2024-10-25 17-32-40.mp4')
  .outputOptions(['-vcodec libx264', '-crf 28'])
  .save('../uploads/output_video.mp4')
  .on('end', () => {
    console.log('Conversão concluída!');
  })
  .on('error', (err) => {
    console.error('Erro ao compactar o vídeo:', err);
  });
