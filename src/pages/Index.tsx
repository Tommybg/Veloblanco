
import SearchHeader from "@/components/SearchHeader";

const Index = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <div className="container mx-auto px-4 py-16">
        <SearchHeader />
        
        {/* Call to action section */}
        <div className="mt-24 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-semibold text-foreground">
              ¿Cómo funciona Veloblanco?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground">Busca cualquier tema</h3>
                <p className="text-muted-foreground">
                  Ingresa cualquier noticia o tema de actualidad que quieras analizar
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground">Análisis automático</h3>
                <p className="text-muted-foreground">
                  Nuestro algoritmo analiza múltiples fuentes desde diferentes perspectivas
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground">Visión completa</h3>
                <p className="text-muted-foreground">
                  Obtén un resumen neutral y perspectivas balanceadas del tema
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
