import React, { useState, useEffect } from 'react';
import type { Location, Review, User } from '../types';

interface LocationDetailsPanelProps {
    location: Location | null;
    onClearSelection: () => void;
    onStreetViewClick: () => void;
    onUploadClick: () => void;
    onEditClick: () => void;
    onAddReviewClick: () => void;
    user: User;
}

type Tab = 'details' | 'faculty' | 'notices' | 'reviews';

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${filled ? 'text-yellow-400' : 'text-gray-600'}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const LocationDetailsPanel: React.FC<LocationDetailsPanelProps> = ({ location, onClearSelection, onStreetViewClick, onUploadClick, onEditClick, onAddReviewClick, user }) => {
    const [activeTab, setActiveTab] = useState<Tab>('details');

    useEffect(() => {
        if (location) {
            setActiveTab('details');
        }
    }, [location]);

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => <StarIcon key={i} filled={i < rating} />);
    };
    
    const TabButton: React.FC<{ tab: Tab; label: string }> = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab 
                ? 'text-cyan-300 border-b-2 border-cyan-300' 
                : 'text-gray-400 hover:text-white'
            }`}
        >
            {label}
        </button>
    );
    
    const futuristicBackgroundStyle: React.CSSProperties = {
        backgroundColor: 'rgba(13, 17, 23, 0.9)',
        backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        backdropFilter: 'blur(8px)',
    };

    return (
        <div className={`fixed z-30 bottom-0 right-0 md:top-0 md:bottom-auto w-full md:w-96 h-auto md:h-full max-h-[75vh] md:max-h-full rounded-t-2xl md:rounded-none transform transition-transform duration-500 ease-in-out ${location ? 'translate-y-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'}`}>
            <div 
                className="w-full h-full p-4 md:p-6 shadow-2xl text-gray-200 flex flex-col border-l border-white/10"
                style={futuristicBackgroundStyle}
            >
                {location && (
                    <>
                        {/* Mobile grabber handle */}
                        <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mb-2 md:hidden"></div>
                        
                        {/* Header */}
                        <div className="flex-shrink-0">
                            <div className="flex items-start justify-between">
                                <h2 className="text-2xl md:text-3xl font-bold text-cyan-300 drop-shadow-[0_0_8px_rgba(0,200,255,0.6)]">{location.name}</h2>
                                <button onClick={onClearSelection} className="p-1 rounded-full hover:bg-white/10 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="mt-4 border-b border-cyan-400/20">
                                <nav className="-mb-px flex space-x-2 sm:space-x-4">
                                    <TabButton tab="details" label="Details" />
                                    <TabButton tab="faculty" label="Faculty" />
                                    <TabButton tab="notices" label="Notices" />
                                    <TabButton tab="reviews" label="Reviews" />
                                </nav>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-grow overflow-y-auto mt-4 p-2 sm:p-4 rounded-lg bg-black/40 border border-white/10 min-h-[150px]">
                            {activeTab === 'details' && <p className="text-base text-gray-300">{location.description}</p>}
                            {activeTab === 'faculty' && (
                                <ul className="space-y-3">
                                    {location.faculty?.length ? location.faculty.map(f => (
                                        <li key={f.id} className="p-3 bg-white/5 rounded-lg">
                                            <p className="font-semibold">{f.name}</p>
                                            <p className="text-sm text-gray-400">{f.title}</p>
                                            <p className="text-sm text-cyan-400">{f.email}</p>
                                        </li>
                                    )) : <p className="text-gray-400">No faculty information available.</p>}
                                </ul>
                            )}
                             {activeTab === 'notices' && (
                                <ul className="space-y-3">
                                    {location.notices?.length ? location.notices.map(n => (
                                        <li key={n.id} className="p-3 bg-white/5 rounded-lg">
                                            <p className="font-semibold">{n.title} <span className="text-xs text-gray-500 ml-2">{n.date}</span></p>
                                            <p className="text-sm text-gray-300 mt-1">{n.content}</p>
                                        </li>
                                    )) : <p className="text-gray-400">No notices available.</p>}
                                </ul>
                            )}
                             {activeTab === 'reviews' && (
                                <div className="flex flex-col h-full">
                                    <div className="flex-grow space-y-4 overflow-y-auto">
                                        {location.reviews?.length ? location.reviews.map(r => (
                                            <div key={r.id} className="p-3 bg-white/5 rounded-lg">
                                                <div className="flex justify-between items-center">
                                                    <p className="font-semibold">{r.author}</p>
                                                    <div className="flex">{renderStars(r.rating)}</div>
                                                </div>
                                                <p className="text-sm text-gray-300 mt-1">{r.comment}</p>
                                                <p className="text-xs text-gray-500 text-right mt-2">{r.date}</p>
                                            </div>
                                        )) : <p className="text-gray-400 text-center pt-8">No reviews yet. Be the first to leave one!</p>}
                                    </div>
                                    <button onClick={onAddReviewClick} className="mt-4 flex-shrink-0 w-full px-4 py-2 sm:py-3 text-base sm:text-lg font-semibold text-cyan-300 uppercase transition-all duration-300 transform bg-cyan-400/10 border-2 border-cyan-400 rounded-lg shadow-lg hover:bg-cyan-400/20 hover:scale-105">
                                        Leave a Review
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex-shrink-0 space-y-4 pt-4 border-t border-cyan-400/20">
                            <button onClick={onStreetViewClick} disabled={!location.streetViewImage} className="w-full px-4 py-3 text-lg font-semibold text-white uppercase transition-all duration-300 transform bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg shadow-lg hover:shadow-cyan-400/50 hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none">Enter Street View</button>
                            {user?.type === 'admin' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={onEditClick} className="w-full px-4 py-2 text-base font-semibold text-cyan-300 uppercase transition-colors bg-cyan-400/10 border border-cyan-400/50 rounded-lg hover:bg-cyan-400/20">Edit</button>
                                    <button onClick={onUploadClick} className="w-full px-4 py-2 text-base font-semibold text-cyan-300 uppercase transition-colors bg-cyan-400/10 border border-cyan-400/50 rounded-lg hover:bg-cyan-400/20">Upload 360°</button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default LocationDetailsPanel;