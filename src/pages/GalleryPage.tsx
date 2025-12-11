import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Image, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description: string | null;
  category: string;
}

const defaultGalleryItems = [
  { id: 'd1', category: 'campus', title: 'Main Building', description: 'Our beautiful main school building', url: '' },
  { id: 'd2', category: 'classroom', title: 'Smart Classroom', description: 'Interactive learning environment', url: '' },
  { id: 'd3', category: 'sports', title: 'Sports Day', description: 'Annual sports competition', url: '' },
  { id: 'd4', category: 'events', title: 'Annual Day', description: 'Cultural performances by students', url: '' },
  { id: 'd5', category: 'campus', title: 'Library', description: 'Well-stocked library', url: '' },
  { id: 'd6', category: 'sports', title: 'Swimming Pool', description: 'Olympic-size swimming pool', url: '' },
  { id: 'd7', category: 'classroom', title: 'Computer Lab', description: 'Modern IT infrastructure', url: '' },
  { id: 'd8', category: 'events', title: 'Independence Day', description: 'Flag hoisting ceremony', url: '' },
];

const categories = [
  { id: 'all', name: 'All Photos' },
  { id: 'campus', name: 'Campus' },
  { id: 'classroom', name: 'Classrooms' },
  { id: 'sports', name: 'Sports' },
  { id: 'events', name: 'Events' },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (!error && data) {
      setGalleryImages(data);
    }
    setLoading(false);
  };

  // Merge uploaded images with defaults (uploaded first)
  const allItems = [
    ...galleryImages.map(img => ({
      id: img.id,
      category: img.category,
      title: img.title,
      description: img.description || '',
      url: img.url,
    })),
    ...defaultGalleryItems,
  ];

  const filteredItems = selectedCategory === 'all' 
    ? allItems 
    : allItems.filter(item => item.category === selectedCategory);

  const handlePrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < filteredItems.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const selectedItem = selectedIndex !== null ? filteredItems[selectedIndex] : null;

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="bg-gradient-hero py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-accent animate-float" />
          <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-primary-foreground/20 animate-float delay-300" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl animate-fade-in-up">
            <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent rounded-full text-sm font-body font-medium mb-4">
              Our Moments
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Photo Gallery
            </h1>
            <p className="font-body text-primary-foreground/80 text-base md:text-lg">
              Explore moments from our vibrant campus life, events, and activities at Vinayak International School.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-12 animate-fade-in-up delay-100">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full font-body font-medium text-sm md:text-base transition-all duration-400 transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {category.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Gallery Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {filteredItems.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedIndex(index)}
                    className="aspect-square rounded-xl overflow-hidden cursor-pointer group relative shadow-soft hover:shadow-hover transition-all duration-500 hover-lift animate-fade-in-up"
                    style={{ animationDelay: `${(index % 8) * 75}ms` }}
                  >
                    {item.url ? (
                      <img 
                        src={item.url} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-soft">
                        <Image className="h-10 w-10 md:h-12 md:w-12 text-primary/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400">
                      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-400">
                        <h3 className="font-display font-semibold text-primary-foreground text-sm md:text-base">
                          {item.title}
                        </h3>
                        <p className="font-body text-primary-foreground/80 text-xs md:text-sm line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12 animate-fade-in">
                  <Image className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-float" />
                  <p className="font-body text-muted-foreground">No photos found in this category.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Navigation Arrows */}
          {selectedIndex !== null && selectedIndex > 0 && (
            <button 
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 p-2 md:p-3 text-primary-foreground hover:bg-primary-foreground/10 rounded-full transition-all duration-300 hover:scale-110 z-10"
              onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
            >
              <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
            </button>
          )}
          
          {selectedIndex !== null && selectedIndex < filteredItems.length - 1 && (
            <button 
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 p-2 md:p-3 text-primary-foreground hover:bg-primary-foreground/10 rounded-full transition-all duration-300 hover:scale-110 z-10"
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
            >
              <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
            </button>
          )}

          <button 
            className="absolute top-4 right-4 p-2 text-primary-foreground hover:bg-primary-foreground/10 rounded-full transition-all duration-300 hover:scale-110"
            onClick={() => setSelectedIndex(null)}
          >
            <X className="h-6 w-6 md:h-8 md:w-8" />
          </button>
          
          <div 
            className="bg-card rounded-2xl p-4 md:p-8 max-w-4xl w-full text-center animate-scale-in shadow-hover"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video bg-muted rounded-xl mb-4 md:mb-6 flex items-center justify-center overflow-hidden">
              {selectedItem.url ? (
                <img 
                  src={selectedItem.url} 
                  alt={selectedItem.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Image className="h-16 w-16 text-primary/30" />
              )}
            </div>
            <h3 className="font-display text-lg md:text-xl font-bold text-foreground mb-2">
              {selectedItem.title}
            </h3>
            <p className="font-body text-muted-foreground text-sm md:text-base">
              {selectedItem.description}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium capitalize">
                {selectedItem.category}
              </span>
              <span className="text-muted-foreground text-xs">
                {selectedIndex !== null && `${selectedIndex + 1} of ${filteredItems.length}`}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
