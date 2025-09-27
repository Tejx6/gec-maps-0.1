


import React, { useState, useEffect } from 'react';
import ClassicApp from './ClassicApp';
import FuturisticApp from './FuturisticApp';
import AuthModal from './components/AuthModal';
import AdminSettingsModal from './components/AdminSettingsModal';
import type { ViewMode, Location, Event, User, Review } from './types';
import { INITIAL_LOCATIONS, INITIAL_EVENTS, getIconComponent, FUTURISTIC_COLOR_PALETTE } from './constants';

const App: React.FC = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('classic');
    
    const [locations, setLocations] = useState<Location[]>(() => {
        try {
            const storedLocations = localStorage.getItem('gec_campus_locations');
            return storedLocations ? JSON.parse(storedLocations) : INITIAL_LOCATIONS;
        } catch (error) {
            console.error("Error parsing locations from localStorage", error);
            return INITIAL_LOCATIONS;
        }
    });

    const [events, setEvents] = useState<Event[]>(() => {
        try {
            const storedEvents = localStorage.getItem('gec_campus_events');
            return storedEvents ? JSON.parse(storedEvents) : INITIAL_EVENTS;
        } catch (error) {
            console.error("Error parsing events from localStorage", error);
            return INITIAL_EVENTS;
        }
    });

    const [user, setUser] = useState<User>({ uid: 'local-guest', type: 'guest', name: 'Guest User' });
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [isAdminSettingsModalOpen, setAdminSettingsModalOpen] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem('gec_campus_locations', JSON.stringify(locations));
        } catch (error) {
            console.error("Error saving locations to localStorage", error);
        }
    }, [locations]);

    useEffect(() => {
        try {
            localStorage.setItem('gec_campus_events', JSON.stringify(events));
        } catch (error) {
            console.error("Error saving events to localStorage", error);
        }
    }, [events]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('view') === 'futuristic') {
            setViewMode('futuristic');
        }
    }, []); 

    // --- Auth Handlers ---
    const handleSignInGuest = () => {
        setUser({ uid: 'local-guest', type: 'guest', name: 'Guest User' });
        setAuthModalOpen(false);
    };

    const handleSignUpAdmin = async (email: string, password: string, name: string): Promise<boolean> => {
        const existingAdmin = localStorage.getItem('gec_admin_user');
        if (existingAdmin) {
            return false; // Admin already exists
        }
        const newAdmin = { email, password, name };
        localStorage.setItem('gec_admin_user', JSON.stringify(newAdmin));
        setUser({ uid: 'local-admin', type: 'admin', name: name });
        return true;
    };

    const handleLoginAdmin = async (email: string, password: string): Promise<boolean> => {
        const storedAdminJSON = localStorage.getItem('gec_admin_user');
        if (!storedAdminJSON) {
            return false; // No admin found
        }
        const storedAdmin = JSON.parse(storedAdminJSON);
        if (storedAdmin.email === email && storedAdmin.password === password) {
            setUser({ uid: 'local-admin', type: 'admin', name: storedAdmin.name || email });
            return true;
        }
        return false; // Invalid credentials
    };

    const handleUpdateAdmin = async (data: { name: string; newPassword?: string; currentPassword: string }): Promise<{ success: boolean; message: string }> => {
        const storedAdminJSON = localStorage.getItem('gec_admin_user');
        if (!storedAdminJSON) {
            return { success: false, message: 'Admin user not found.' };
        }
        
        const storedAdmin = JSON.parse(storedAdminJSON);
        
        if (storedAdmin.password !== data.currentPassword) {
            return { success: false, message: 'Incorrect current password.' };
        }
        
        const updatedAdmin = {
            ...storedAdmin,
            name: data.name,
            password: data.newPassword || storedAdmin.password, // Update password if new one is provided
        };
        
        localStorage.setItem('gec_admin_user', JSON.stringify(updatedAdmin));
        
        setUser(prevUser => prevUser ? { ...prevUser, name: data.name } : null);
        
        return { success: true, message: 'Settings updated successfully!' };
    };


    const handleSignOut = () => {
        setUser(null);
    };

    // --- Data Manipulation Handlers ---

    const handleUpdateLocation = (updatedLocation: Location) => {
        setLocations(prevLocations => prevLocations.map(loc => loc.id === updatedLocation.id ? updatedLocation : loc));
    };

    const handleAddLocation = (newLocationData: Partial<Location>, coords: { x: number, y: number }) => {
        const newLocation: Location = {
            id: `loc_${Date.now()}`,
            name: newLocationData.name || 'New Location',
            description: newLocationData.description || '',
            position: coords,
            streetViewImage: null,
            iconId: newLocationData.iconId,
            color: FUTURISTIC_COLOR_PALETTE[locations.length % FUTURISTIC_COLOR_PALETTE.length],
            faculty: [],
            notices: [],
            reviews: []
        };
        setLocations(prevLocations => [...prevLocations, newLocation]);
    };
    
    const handleDeleteLocation = (locationId: string) => {
        setLocations(prevLocations => prevLocations.filter(loc => loc.id !== locationId));
    };
    
    const handleAddEvent = (newEventData: { name: string; description: string; }, coords: { x: number, y: number }) => {
        const newEvent: Event = {
            ...newEventData,
            id: `evt_${Date.now()}`,
            position: coords,
        };
        setEvents(prevEvents => [...prevEvents, newEvent]);
    };

    const handleDeleteEvent = (eventId: string) => {
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    };
    
    const handleAddReview = (locationId: string, reviewData: { rating: number; comment: string; }) => {
        if (!user) return;
        const newReview: Review = { 
            ...reviewData, 
            author: user.name, 
            id: `rev_${Date.now()}`, 
            date: new Date().toISOString().split('T')[0] 
        };
        setLocations(prevLocations => prevLocations.map(loc => {
            if (loc.id === locationId) {
                const updatedLocation = { ...loc, reviews: [...(loc.reviews || []), newReview] };
                return updatedLocation;
            }
            return loc;
        }));
    };

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('view-classic', 'view-futuristic');
        root.classList.add(`view-${viewMode}`);
    }, [viewMode]);

    const toggleViewMode = () => {
        setViewMode(prev => (prev === 'classic' ? 'futuristic' : 'classic'));
    };

    const locationsWithIcons = locations.map(loc => {
        if (loc.iconId) {
            const IconComponent = getIconComponent(loc.iconId);
            return { ...loc, icon: IconComponent ? React.createElement(IconComponent) : undefined };
        }
        return loc;
    });

    const dataProps = {
        locations: locationsWithIcons,
        events,
        user,
        onUpdateLocation: handleUpdateLocation,
        onAddLocation: handleAddLocation,
        onDeleteLocation: handleDeleteLocation,
        onAddEvent: handleAddEvent,
        onDeleteEvent: handleDeleteEvent,
        onAddReview: handleAddReview,
        onOpenAuthModal: () => setAuthModalOpen(true),
        onSignOut: handleSignOut,
        onOpenAdminSettingsModal: () => setAdminSettingsModalOpen(true),
    };

    return (
        <>
            {viewMode === 'futuristic' ? (
                <FuturisticApp 
                    onToggleViewMode={toggleViewMode} 
                    {...dataProps}
                />
            ) : (
                <ClassicApp 
                    onToggleViewMode={toggleViewMode} 
                    {...dataProps}
                />
            )}
            {isAuthModalOpen && (
                <AuthModal
                    onClose={() => setAuthModalOpen(false)}
                    onSignInGuest={handleSignInGuest}
                    onLoginAdmin={handleLoginAdmin}
                    onSignUpAdmin={handleSignUpAdmin}
                />
            )}
            {isAdminSettingsModalOpen && user?.type === 'admin' && (
                <AdminSettingsModal
                    user={user}
                    onClose={() => setAdminSettingsModalOpen(false)}
                    onSave={handleUpdateAdmin}
                />
            )}
        </>
    );
};

export default App;