import { useState } from 'react';
import { Image, Video, X } from 'lucide-react';

const galleryItems = [
  { id: 1, type: 'image', category: 'campus', title: 'Main Building', description: 'Our beautiful main school building' },
  { id: 2, type: 'image', category: 'classroom', title: 'Smart Classroom', description: 'Interactive learning environment' },
  { id: 3, type: 'image', category: 'sports', title: 'Sports Day', description: 'Annual sports competition' },
  { id: 4, type: 'image', category: 'events', title: 'Annual Day', description: 'Cultural performances by students' },
  { id: 5, type: 'image', category: 'campus', title: 'Library', description: 'Well-stocked library' },
  { id: 6, type: 'image', category: 'sports', title: 'Swimming Pool', description: 'Olympic-size swimming pool' },
  { id: 7, type: 'image', category: 'classroom', title: 'Computer Lab', description: 'Modern IT infrastructure' },
  { id: 8, type: 'image', category: 'events', title: 'Independence Day', description: 'Flag hoisting ceremony' },
  { id: 9, type: 'image', category: 'campus', title: 'Playground', description: 'Expansive play areas' },
  { id: 10, type: 'image', category: 'classroom', title: 'Science Lab', description: 'Hands-on experiments' },
  { id: 11, type: 'image', category: 'events', title: 'Art Exhibition', description: 'Student artwork display' },
  { id: 12, type: 'image', category: 'sports', title: 'Cricket Match', description: 'Inter-school tournament' },
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
  const [selectedItem, setSelectedItem] = useState<typeof galleryItems[0] | null>(null);

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Photo Gallery
            </h1>
            <p className="font-body text-primary-foreground/80 text-lg">
              Explore moments from our vibrant campus life, events, and activities.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2 rounded-full font-body font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="aspect-square bg-muted rounded-xl overflow-hidden cursor-pointer group relative shadow-soft hover:shadow-hover transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                  {item.type === 'image' ? (
                    <Image className="h-12 w-12 text-primary/30" />
                  ) : (
                    <Video className="h-12 w-12 text-primary/30" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-display font-semibold text-primary-foreground text-sm">
                      {item.title}
                    </h3>
                    <p className="font-body text-primary-foreground/80 text-xs">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="font-body text-muted-foreground">No photos found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <button 
            className="absolute top-4 right-4 p-2 text-primary-foreground hover:bg-primary-foreground/10 rounded-full transition-colors"
            onClick={() => setSelectedItem(null)}
          >
            <X className="h-8 w-8" />
          </button>
          <div 
            className="bg-card rounded-2xl p-8 max-w-2xl w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video bg-muted rounded-lg mb-6 flex items-center justify-center">
              <Image className="h-16 w-16 text-primary/30" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">
              {selectedItem.title}
            </h3>
            <p className="font-body text-muted-foreground">
              {selectedItem.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
