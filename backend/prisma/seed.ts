/// <reference types="node" />
import { PrismaClient, MediaType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Garante a existência de um autor padrão
  const author = await prisma.user.upsert({
    where: { email: 'tech.writer@example.com' },
    update: {},
    create: {
      name: 'Tech Writer',
      email: 'tech.writer@example.com',
      role: 'PUBLISHER',
    },
  });

  // Categoria padrão para as notícias de tecnologia
  const category = await prisma.category.upsert({
    where: { name: 'Tecnologia' },
    update: {},
    create: { name: 'Tecnologia' },
  });

  // Dados das notícias
  const newsData = [
    {
      title: 'OpenAI lança GPT-5 com avanços em raciocínio e eficiência',
      text: 'A OpenAI anunciou o lançamento do GPT-5, a nova geração do seu modelo de linguagem que promete maior capacidade de raciocínio lógico e eficiência energética. Empresas já planejam integrar o modelo em suas soluções de atendimento e análise de dados.',
      tagsKeywords: ['OpenAI', 'GPT-5', 'IA', 'Modelos de linguagem'],
      media: [
        {
          url: 'https://example.com/images/gpt5.jpg',
          path: '/uploads/gpt5.jpg',
          alt: 'Ilustração representando o GPT-5',
          title: 'Novo GPT-5',
          description: 'Imagem promocional do GPT-5 anunciada pela OpenAI',
          type: MediaType.IMAGE,
          order: 1,
        },
      ],
    },
    {
      title: 'Apple revela chip M4 focado em IA e realidade aumentada',
      text: 'Durante a WWDC, a Apple apresentou o chip M4, projetado para otimizar tarefas de IA e aplicações de realidade aumentada nos próximos MacBooks e dispositivos AR da empresa.',
      tagsKeywords: ['Apple', 'M4', 'AR', 'Processadores'],
      media: [
        {
          url: 'https://example.com/images/apple-m4.jpg',
          path: '/uploads/apple-m4.jpg',
          alt: 'Chip Apple M4 sobre placa lógica',
          title: 'Chip Apple M4',
          description: 'Renderização oficial do chip M4 focado em IA',
          type: MediaType.IMAGE,
          order: 1,
        },
      ],
    },
    {
      title: 'Google anuncia nova ferramenta de privacidade no Android 15',
      text: 'O Android 15 chega com uma camada extra de privacidade que permite ao usuário bloquear o acesso a sensores por aplicativo, impedindo o uso não autorizado de câmera, microfone e localização.',
      tagsKeywords: ['Google', 'Android 15', 'Privacidade', 'Segurança móvel'],
      media: [
        {
          url: 'https://example.com/images/android15-privacy.jpg',
          path: '/uploads/android15-privacy.jpg',
          alt: 'Tela demonstrando nova ferramenta de privacidade no Android 15',
          title: 'Privacidade no Android 15',
          description:
            'Interface da nova ferramenta de privacidade do Android 15',
          type: MediaType.IMAGE,
          order: 1,
        },
      ],
    },
    {
      title: 'Microsoft lança serviço de computação quântica em nuvem',
      text: 'A Microsoft anunciou o Azure Quantum Compute, serviço que oferece acesso a processadores quânticos otimizados para pesquisas acadêmicas e aplicações corporativas, democratizando a computação quântica.',
      tagsKeywords: ['Microsoft', 'Azure', 'Computação quântica', 'Nuvem'],
      media: [
        {
          url: 'https://example.com/images/azure-quantum.jpg',
          path: '/uploads/azure-quantum.jpg',
          alt: 'Ilustração de um computador quântico no Azure',
          title: 'Azure Quantum',
          description:
            'Computador quântico representado na identidade visual do Azure',
          type: MediaType.IMAGE,
          order: 1,
        },
      ],
    },
    {
      title: 'Samsung apresenta bateria de estado sólido com autonomia recorde',
      text: 'A Samsung revelou um protótipo de bateria de estado sólido capaz de oferecer 900 km de autonomia para veículos elétricos, prometendo maior segurança e redução de tempo de recarga.',
      tagsKeywords: [
        'Samsung',
        'Bateria de estado sólido',
        'Veículos elétricos',
        'Inovação',
      ],
      media: [
        {
          url: 'https://example.com/images/samsung-solid-state.jpg',
          path: '/uploads/samsung-solid-state.jpg',
          alt: 'Protótipo de bateria de estado sólido da Samsung',
          title: 'Bateria de Estado Sólido Samsung',
          description:
            'Imagem oficial do protótipo de bateria de estado sólido da Samsung',
          type: MediaType.IMAGE,
          order: 1,
        },
      ],
    },
  ];

  // Cria cada notícia junto com sua mídia e categoria
  for (const news of newsData) {
    await prisma.news.create({
      data: {
        title: news.title,
        text: news.text,
        authorId: author.id,
        status: 'APPROVED',
        published: true,
        publishedAt: new Date(),
        tagsKeywords: news.tagsKeywords,
        categories: {
          connect: [{ id: category.id }],
        },
        media: {
          create: news.media.map((m) => ({
            ...m,
          })),
        },
      },
    });
  }

  console.log('🚀  Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
