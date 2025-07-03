import cron from 'node-cron';
import prisma from '../lib/prisma';

/**
 * Publishes all approved news items that are scheduled to be published and have not yet been published.
 *
 * This function queries the database for news items that:
 * - Have a status of 'APPROVED'
 * - Are not yet published (`published: false`)
 * - Have a `publishedAt` date less than or equal to the current date
 *
 * If any such news items are found, it updates their `published` field to `true`.
 */
const publishScheduledNews = async () => {
  const newsToPublish = await prisma.news.findMany({
    where: {
      status: 'APPROVED',
      published: false,
      publishedAt: {
        lte: new Date(),
      },
    },
  });

  if (newsToPublish.length > 0) {
    console.log(
      `[JOB] Encontrados ${newsToPublish.length} notícias para publicar`
    );

    await prisma.news.updateMany({
      where: {
        id: {
          in: newsToPublish.map((news) => news.id),
        },
      },
      data: {
        published: true,
      },
    });
  }
};

/**
 * Archives all published news items whose expiration date has passed and are not already archived.
 *
 * This function queries the database for news items that:
 * - Are published (`published: true`)
 * - Have a status different from 'ARCHIVED'
 * - Have an `expirationDate` less than or equal to the current date
 *
 * If any such news items are found, it updates their status to 'ARCHIVED'.
 */
const archiveExpiredNews = async () => {
  const newsToArchive = await prisma.news.findMany({
    where: {
      status: { not: 'ARCHIVED' },
      published: true,
      expirationDate: {
        lte: new Date(),
      },
    },
  });

  if (newsToArchive.length > 0) {
    console.log(
      `[JOB] Encontrados ${newsToArchive.length} notícias para arquivar`
    );

    await prisma.news.updateMany({
      where: {
        id: { in: newsToArchive.map((news) => news.id) },
      },
      data: {
        status: 'ARCHIVED',
      },
    });
  }
};

const runMaintenanceTasks = async () => {
  console.log(`-- [JOB] Iniciando tarefas de manutenção --`);

  try {
    await publishScheduledNews();
  } catch (error) {
    console.error(`[JOB] ❌ Erro ao executar tarefas de publicação: ${error}`);
  }

  try {
    await archiveExpiredNews();
  } catch (error) {
    console.error(`[JOB] ❌ Erro ao arquivar notícias expiradas: ${error}`);
  }

  console.log(`-- [JOB] Tarefas de manutenção concluídas --`);
};

export const scheduleMaintenanceJob = () => {
  cron.schedule('* * * * *', runMaintenanceTasks);
  console.log(`[JOB] Tarefas de manutenção agendadas para cada minuto`);
};
