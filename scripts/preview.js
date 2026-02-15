import express from 'express';

const dir = process.argv[2] || 'dist';

const notFoundPage = `${process.cwd()}/${dir}/404.html`;

express()
  .use(express.static(dir))
  .use((_, res) => {
    res.status(404).sendFile(notFoundPage);
  })
  .listen(8080, () => {
    console.log(`Preview server for '${dir}' running at http://localhost:8080`);
  });
