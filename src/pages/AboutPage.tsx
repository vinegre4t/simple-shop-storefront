
import Layout from "@/components/layout/Layout";

export default function AboutPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-12">
        <section className="text-center">
          <h1 className="text-3xl font-bold mb-6">О нас</h1>
          <p className="text-xl text-muted-foreground">
            МиниМаркет — это интернет-магазин минималистичных и качественных товаров для повседневной жизни.
          </p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Наша миссия</h2>
          <p>
            Мы верим в простоту и функциональность. Наша миссия — предоставить вам тщательно отобранные 
            товары, которые сочетают в себе минималистичный дизайн, высокое качество материалов и 
            доступные цены.
          </p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Наша история</h2>
          <p>
            МиниМаркет был основан в 2023 году группой энтузиастов минимализма, которые хотели 
            создать пространство, где можно найти красивые и функциональные вещи без лишних деталей.
          </p>
          <p>
            С тех пор мы выросли, но наша философия осталась неизменной: "Меньше, но лучше". 
            Мы тщательно отбираем каждый товар, который появляется в нашем каталоге, и 
            гарантируем его качество.
          </p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Наши принципы</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="font-medium mb-2">Качество превыше всего</h3>
              <p className="text-muted-foreground">
                Мы отбираем товары, которые прослужат вам долгое время, не теряя своей функциональности и внешнего вида.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="font-medium mb-2">Минимализм в дизайне</h3>
              <p className="text-muted-foreground">
                Мы верим, что лучший дизайн — это тот, который не отвлекает, а дополняет вашу жизнь.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="font-medium mb-2">Ответственное потребление</h3>
              <p className="text-muted-foreground">
                Мы поддерживаем идею осознанных покупок и стремимся к устойчивому развитию.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="font-medium mb-2">Честность и прозрачность</h3>
              <p className="text-muted-foreground">
                Мы предоставляем полную информацию о наших товарах и ценовой политике.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
