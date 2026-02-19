import { BufferSource } from '@batchactions/core';
import { BulkImport, CsvParser } from '@batchactions/import';

async function main() {
  const importer = new BulkImport({
    schema: {
      fields: [
        { name: 'email', type: 'email', required: true },
        { name: 'name', type: 'string', required: true },
      ],
    },
    batchSize: 2,
    continueOnError: true,
  });

  const csv = [
    'email,name',
    'ada@example.com,Ada Lovelace',
    'invalid-email,Invalid User',
    'grace@example.com,Grace Hopper',
  ].join('\n');

  importer.from(new BufferSource(csv), new CsvParser());

  const preview = await importer.preview(10);
  console.log('Preview valid:', preview.validRecords.length);
  console.log('Preview invalid:', preview.invalidRecords.length);

  await importer.start(async (record) => {
    // Replace this with your DB/API call in real projects.
    console.log('Processed:', record.email, record.name);
  });

  const status = await importer.getStatus();
  console.log('Job status:', status?.status);
  console.log('Summary:', status?.summary);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
