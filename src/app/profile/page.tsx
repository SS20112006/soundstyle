'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSavedLooksStore, SavedLook, Collection } from '@/stores/savedLooksStore';
import { useAppStore } from '@/stores/appStore';
import { RecommendedItem } from '@/types';

export default function ProfilePage() {
  const { user } = useAppStore();
  const {
    looks,
    collections,
    createCollection,
    removeCollection,
    removeLook,
    addLookToCollection,
    removeLookFromCollection,
    getLooksInCollection,
    loadFromStorage,
    isInitialized,
  } = useSavedLooksStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');
  const [expandedCollection, setExpandedCollection] = useState<string | null>(null);
  const [selectedLook, setSelectedLook] = useState<SavedLook | null>(null);
  const [activeTab, setActiveTab] = useState<'collections' | 'all'>('collections');

  useEffect(() => {
    loadFromStorage();
  }, []);

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return;
    createCollection(newCollectionName.trim(), newCollectionDesc.trim());
    setNewCollectionName('');
    setNewCollectionDesc('');
    setShowCreateModal(false);
  };

  const handleDeleteCollection = (id: string) => {
    removeCollection(id);
    if (expandedCollection === id) setExpandedCollection(null);
  };

  const getLooksCountInCollection = (collectionId: string) => {
    return looks.filter((l) => l.collectionId === collectionId).length;
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-[#c4a882] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c4a882] to-[#8b6f5c] flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">SoundStyle</span>
          </a>
          <nav className="flex items-center gap-4">
            <a href="/dashboard" className="text-sm text-white/50 hover:text-white/80 transition-colors">
              Dashboard
            </a>
            <a href="/explore" className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all" title="Explore">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </a>
            <a href="/profile" className="text-sm text-[#c4a882] font-medium">
              Profile
            </a>
          </nav>
        </div>
      </header>

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* User Header */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-6"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-[#c4a882]/30 bg-white/[0.06] flex items-center justify-center">
              {user?.images?.[0] ? (
                <img src={user.images[0].url} alt={user.display_name} className="w-full h-full object-cover" />
              ) : (
                <svg className="w-10 h-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{user?.display_name || 'Style Collector'}</h1>
              <div className="flex items-center gap-6 mt-2 text-sm text-white/50">
                <span><span className="text-white font-semibold">{looks.length}</span> looks saved</span>
                <span><span className="text-white font-semibold">{collections.length}</span> collections</span>
              </div>
            </div>
          </motion.section>

          {/* Tab Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('collections')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'collections'
                  ? 'bg-gradient-to-r from-[#c4a882] to-[#8b6f5c] text-white'
                  : 'bg-white/[0.06] text-white/50 hover:text-white/80'
              }`}
            >
              Collections
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-[#c4a882] to-[#8b6f5c] text-white'
                  : 'bg-white/[0.06] text-white/50 hover:text-white/80'
              }`}
            >
              All Looks
            </button>
            <div className="flex-1" />
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#c4a882]/10 text-[#c4a882] hover:bg-[#c4a882]/20 text-sm font-medium transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Collection
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'collections' ? (
              <motion.div
                key="collections"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {expandedCollection ? (
                  // Expanded Collection View
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setExpandedCollection(null)}
                        className="p-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] transition-colors"
                      >
                        <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <div>
                        <h2 className="text-2xl font-bold">
                          {collections.find((c) => c.id === expandedCollection)?.name}
                        </h2>
                        <p className="text-sm text-white/50">
                          {collections.find((c) => c.id === expandedCollection)?.description}
                        </p>
                      </div>
                    </div>
                    <MasonryGrid
                      looks={getLooksInCollection(expandedCollection)}
                      onSelect={setSelectedLook}
                      onRemove={removeLook}
                      onRemoveFromCollection={removeLookFromCollection}
                    />
                  </div>
                ) : (
                  // Collections Grid
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.map((collection, index) => (
                      <CollectionCard
                        key={collection.id}
                        collection={collection}
                        looksCount={getLooksCountInCollection(collection.id)}
                        looks={getLooksInCollection(collection.id)}
                        index={index}
                        onExpand={() => setExpandedCollection(collection.id)}
                        onDelete={() => handleDeleteCollection(collection.id)}
                      />
                    ))}
                    {collections.length === 0 && (
                      <div className="col-span-full text-center py-20">
                        <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <p className="text-white/40 text-lg">No collections yet</p>
                        <p className="text-white/25 text-sm mt-1">Create a collection to organize your saved looks</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              // All Looks View
              <motion.div
                key="all-looks"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <MasonryGrid
                  looks={looks}
                  onSelect={setSelectedLook}
                  onRemove={removeLook}
                  onRemoveFromCollection={removeLookFromCollection}
                />
                {looks.length === 0 && (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <p className="text-white/40 text-lg">No saved looks yet</p>
                    <p className="text-white/25 text-sm mt-1">Go to the dashboard and save your favorite outfits</p>
                    <a
                      href="/dashboard"
                      className="inline-block mt-6 px-6 py-2.5 bg-gradient-to-r from-[#c4a882] to-[#8b6f5c] rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      Generate Looks
                    </a>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Create Collection Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-6"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#1a1a1a] rounded-2xl border border-white/[0.08] overflow-hidden"
            >
              <div className="p-6 space-y-5">
                <h2 className="text-xl font-bold">Create Collection</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-white/50 mb-1.5 block">Name</label>
                    <input
                      type="text"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      placeholder="e.g., Festival Fits, Work Looks..."
                      className="w-full px-4 py-3 bg-white/[0.06] rounded-xl border border-white/[0.08] text-white placeholder:text-white/25 focus:outline-none focus:border-[#c4a882]/50 transition-colors"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/50 mb-1.5 block">Description (optional)</label>
                    <textarea
                      value={newCollectionDesc}
                      onChange={(e) => setNewCollectionDesc(e.target.value)}
                      placeholder="What's this collection about?"
                      rows={3}
                      className="w-full px-4 py-3 bg-white/[0.06] rounded-xl border border-white/[0.08] text-white placeholder:text-white/25 focus:outline-none focus:border-[#c4a882]/50 transition-colors resize-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/[0.06] text-white/70 font-medium hover:bg-white/[0.1] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateCollection}
                    disabled={!newCollectionName.trim()}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#c4a882] to-[#8b6f5c] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Create
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Look Detail Modal */}
      <AnimatePresence>
        {selectedLook && (
          <LookDetailModal
            look={selectedLook}
            collections={collections}
            onClose={() => setSelectedLook(null)}
            onRemove={() => {
              removeLook(selectedLook.id);
              setSelectedLook(null);
            }}
            onMoveToCollection={(collectionId) => {
              addLookToCollection(selectedLook.id, collectionId);
              setSelectedLook(null);
            }}
            onRemoveFromCollection={() => {
              removeLookFromCollection(selectedLook.id);
              setSelectedLook(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// COMPONENTS
// ==========================================

function CollectionCard({
  collection,
  looksCount,
  looks,
  index,
  onExpand,
  onDelete,
}: {
  collection: Collection;
  looksCount: number;
  looks: SavedLook[];
  index: number;
  onExpand: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
    >
      <button
        onClick={onExpand}
        className="w-full text-left rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-[#c4a882]/30 transition-all overflow-hidden"
      >
        {/* Cover Preview */}
        <div
          className="h-36 relative"
          style={{
            background: `linear-gradient(135deg, ${collection.coverColor}40, ${collection.coverColor}10)`,
          }}
        >
          {looks.slice(0, 3).map((look, i) => (
            <div
              key={look.id}
              className="absolute w-16 h-20 rounded-lg bg-white/[0.08] border border-white/[0.1] overflow-hidden shadow-lg"
              style={{
                left: `${20 + i * 28}px`,
                top: `${20 + i * 8}px`,
                zIndex: 3 - i,
                transform: `rotate(${-6 + i * 6}deg)`,
              }}
            >
              {look.items[0]?.imageUrl && (
                <img src={look.items[0].imageUrl} alt="" className="w-full h-full object-cover" />
              )}
            </div>
          ))}
          {looks.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/[0.08] flex items-center justify-center">
                <svg className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          )}
        </div>
        {/* Info */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold truncate">{collection.name}</h3>
            <span className="text-xs text-white/40">{looksCount} looks</span>
          </div>
          {collection.description && (
            <p className="text-sm text-white/40 mt-1 truncate">{collection.description}</p>
          )}
        </div>
      </button>
      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all"
      >
        <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </motion.div>
  );
}

function MasonryGrid({
  looks,
  onSelect,
  onRemove,
  onRemoveFromCollection,
}: {
  looks: SavedLook[];
  onSelect: (look: SavedLook) => void;
  onRemove: (id: string) => void;
  onRemoveFromCollection: (id: string) => void;
}) {
  if (looks.length === 0) return null;

  // Distribute into 3 columns
  const columns: SavedLook[][] = [[], [], []];
  looks.forEach((look, i) => {
    columns[i % 3].push(look);
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {columns.map((col, colIndex) => (
        <div key={colIndex} className="space-y-4">
          {col.map((look, index) => (
            <LookCard
              key={look.id}
              look={look}
              index={colIndex * 10 + index}
              onSelect={() => onSelect(look)}
              onRemove={() => onRemove(look.id)}
              onRemoveFromCollection={() => onRemoveFromCollection(look.id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function LookCard({
  look,
  index,
  onSelect,
  onRemove,
  onRemoveFromCollection,
}: {
  look: SavedLook;
  index: number;
  onSelect: () => void;
  onRemove: () => void;
  onRemoveFromCollection: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      className="group relative rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-[#c4a882]/30 transition-all overflow-hidden cursor-pointer"
      onClick={onSelect}
    >
      {/* Items Preview */}
      <div className="p-4 grid grid-cols-2 gap-2">
        {look.items.slice(0, 4).map((item, i) => (
          <div key={i} className="aspect-square rounded-lg bg-white/[0.06] overflow-hidden">
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            )}
          </div>
        ))}
        {look.items.length < 4 &&
          Array.from({ length: 4 - look.items.length }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square rounded-lg bg-white/[0.03]" />
          ))}
      </div>
      {/* Info */}
      <div className="px-4 pb-4">
        <h3 className="font-semibold text-sm truncate">{look.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-[#c4a882]">{look.occasion}</span>
          <span className="text-white/20">·</span>
          <span className="text-xs text-white/40 capitalize">{look.source.type}: {look.source.name}</span>
        </div>
      </div>
      {/* Menu button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:bg-white/[0.1] transition-all"
      >
        <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
      {/* Dropdown menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-12 right-3 z-10 bg-[#1a1a1a] rounded-xl border border-white/[0.08] shadow-xl overflow-hidden min-w-[160px]"
          >
            {look.collectionId && (
              <button
                onClick={() => {
                  onRemoveFromCollection();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2.5 text-sm text-left text-white/70 hover:bg-white/[0.06] transition-colors"
              >
                Remove from collection
              </button>
            )}
            <button
              onClick={() => {
                onRemove();
                setShowMenu(false);
              }}
              className="w-full px-4 py-2.5 text-sm text-left text-red-400 hover:bg-red-500/10 transition-colors"
            >
              Delete look
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LookDetailModal({
  look,
  collections,
  onClose,
  onRemove,
  onMoveToCollection,
  onRemoveFromCollection,
}: {
  look: SavedLook;
  collections: Collection[];
  onClose: () => void;
  onRemove: () => void;
  onMoveToCollection: (collectionId: string) => void;
  onRemoveFromCollection: () => void;
}) {
  const [showCollections, setShowCollections] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#1a1a1a] rounded-2xl border border-white/[0.08] overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{look.name}</h2>
            <p className="text-sm text-white/50 mt-1">
              {look.occasion} · {look.source.type}: {look.source.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
          >
            <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items Grid */}
        <div className="p-6 space-y-4">
          <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">Outfit Items</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {look.items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl bg-white/[0.04] border border-white/[0.08] overflow-hidden"
              >
                <div className="aspect-square bg-white/[0.06]">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-xs text-white/40 mt-0.5">{item.brand}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-[#c4a882]">${item.price?.toFixed(2)}</span>
                    <span className="text-xs text-white/30">{item.category}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Style Profile */}
        {look.styleProfile && (
          <div className="px-6 pb-6 space-y-4">
            <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">Style Profile</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-full bg-[#c4a882]/10 text-[#c4a882] text-xs font-medium">
                {look.styleProfile.aesthetic}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/[0.06] text-white/60 text-xs">
                {look.styleProfile.fit} fit
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/[0.06] text-white/60 text-xs">
                {look.styleProfile.mood}
              </span>
            </div>
            {look.styleProfile.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {look.styleProfile.keywords.map((kw, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full bg-white/[0.04] text-white/40 text-xs">
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="p-6 border-t border-white/[0.08] flex items-center gap-3">
          {showCollections ? (
            <div className="w-full space-y-2">
              <p className="text-sm text-white/50 mb-2">Choose a collection:</p>
              {collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => onMoveToCollection(collection.id)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.06] text-left text-sm text-white/70 hover:bg-white/[0.1] transition-colors"
                >
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: collection.coverColor }}
                  />
                  {collection.name}
                </button>
              ))}
              <button
                onClick={() => setShowCollections(false)}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/60 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              {look.collectionId ? (
                <button
                  onClick={onRemoveFromCollection}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/[0.06] text-white/70 text-sm font-medium hover:bg-white/[0.1] transition-colors"
                >
                  Remove from Collection
                </button>
              ) : collections.length > 0 ? (
                <button
                  onClick={() => setShowCollections(true)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/[0.06] text-white/70 text-sm font-medium hover:bg-white/[0.1] transition-colors"
                >
                  Add to Collection
                </button>
              ) : null}
              <button
                onClick={onRemove}
                className="px-4 py-3 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
              >
                Delete Look
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
