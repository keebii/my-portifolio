// React Components for Portfolio

// Gallery Component
const Gallery = () => {
    const [photos, setPhotos] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    // Load photos from localStorage on component mount
    React.useEffect(() => {
        const savedPhotos = localStorage.getItem('galleryPhotos');
        if (savedPhotos) {
            setPhotos(JSON.parse(savedPhotos));
        }
    }, []);

    // Save photos to localStorage whenever photos change
    React.useEffect(() => {
        localStorage.setItem('galleryPhotos', JSON.stringify(photos));
    }, [photos]);

    const handlePhotoUpload = (event) => {
        const files = Array.from(event.target.files);
        setIsLoading(true);

        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const newPhoto = {
                        id: Date.now() + Math.random(),
                        src: e.target.result,
                        name: file.name,
                        uploadDate: new Date().toISOString()
                    };
                    setPhotos(prev => [newPhoto, ...prev]);
                };
                reader.readAsDataURL(file);
            }
        });

        setIsLoading(false);
        event.target.value = '';
    };

    const deletePhoto = (photoId) => {
        setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    };

    return React.createElement('div', { className: 'react-gallery' },
        React.createElement('div', { className: 'gallery-controls' },
            React.createElement('input', {
                type: 'file',
                id: 'reactGalleryInput',
                accept: 'image/*',
                multiple: true,
                style: { display: 'none' },
                onChange: handlePhotoUpload
            }),
            React.createElement('button', {
                className: 'upload-btn gallery-upload-btn',
                onClick: () => document.getElementById('reactGalleryInput').click(),
                disabled: isLoading
            },
                React.createElement('i', { className: 'fas fa-plus' }),
                isLoading ? ' Uploading...' : ' Add Photos'
            )
        ),
        React.createElement('div', { className: 'gallery-grid' },
            // Default placeholder items
            React.createElement('div', { className: 'gallery-item' },
                React.createElement('div', { className: 'gallery-placeholder' },
                    React.createElement('i', { className: 'fas fa-image' }),
                    React.createElement('p', null, 'Project Screenshot 1')
                )
            ),
            React.createElement('div', { className: 'gallery-item' },
                React.createElement('div', { className: 'gallery-placeholder' },
                    React.createElement('i', { className: 'fas fa-image' }),
                    React.createElement('p', null, 'Project Screenshot 2')
                )
            ),
            React.createElement('div', { className: 'gallery-item' },
                React.createElement('div', { className: 'gallery-placeholder' },
                    React.createElement('i', { className: 'fas fa-image' }),
                    React.createElement('p', null, 'Development Process')
                )
            ),
            // Uploaded photos
            ...photos.map(photo =>
                React.createElement('div', {
                    key: photo.id,
                    className: 'gallery-item uploaded-photo'
                },
                    React.createElement('img', {
                        src: photo.src,
                        alt: photo.name
                    }),
                    React.createElement('div', { className: 'gallery-item-overlay' },
                        React.createElement('button', {
                            className: 'delete-btn',
                            onClick: () => deletePhoto(photo.id)
                        },
                            React.createElement('i', { className: 'fas fa-trash' }),
                            ' Delete'
                        )
                    )
                )
            )
        )
    );
};

// Project Gallery Component
const ProjectGallery = ({ projectName, isOpen, onClose }) => {
    const [projectPhotos, setProjectPhotos] = React.useState([]);

    React.useEffect(() => {
        if (projectName) {
            const savedPhotos = localStorage.getItem(`project_${projectName}_photos`);
            if (savedPhotos) {
                setProjectPhotos(JSON.parse(savedPhotos));
            }
        }
    }, [projectName]);

    React.useEffect(() => {
        if (projectName) {
            localStorage.setItem(`project_${projectName}_photos`, JSON.stringify(projectPhotos));
        }
    }, [projectPhotos, projectName]);

    const handlePhotoUpload = (event) => {
        const files = Array.from(event.target.files);
        
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const newPhoto = {
                        id: Date.now() + Math.random(),
                        src: e.target.result,
                        name: file.name,
                        uploadDate: new Date().toISOString()
                    };
                    setProjectPhotos(prev => [newPhoto, ...prev]);
                };
                reader.readAsDataURL(file);
            }
        });
        
        event.target.value = '';
    };

    const deletePhoto = (photoId) => {
        setProjectPhotos(prev => prev.filter(photo => photo.id !== photoId));
    };

    if (!isOpen) return null;

    return React.createElement('div', {
        className: 'project-modal project-gallery-modal',
        onClick: (e) => e.target.classList.contains('project-modal') && onClose()
    },
        React.createElement('div', { className: 'modal-content' },
            React.createElement('span', {
                className: 'close-modal',
                onClick: onClose
            }, '×'),
            React.createElement('div', { className: 'project-gallery-header' },
                React.createElement('h3', null, `${projectName} Gallery`),
                React.createElement('div', { className: 'project-gallery-upload' },
                    React.createElement('input', {
                        type: 'file',
                        id: `project-${projectName}-input`,
                        accept: 'image/*',
                        multiple: true,
                        style: { display: 'none' },
                        onChange: handlePhotoUpload
                    }),
                    React.createElement('button', {
                        className: 'upload-btn',
                        onClick: () => document.getElementById(`project-${projectName}-input`).click()
                    },
                        React.createElement('i', { className: 'fas fa-plus' }),
                        ' Add Photos'
                    )
                )
            ),
            React.createElement('div', { className: 'project-gallery-grid' },
                projectPhotos.length === 0 ?
                    React.createElement('div', { className: 'project-gallery-item' },
                        React.createElement('div', { className: 'project-gallery-placeholder' },
                            React.createElement('i', { className: 'fas fa-image' }),
                            React.createElement('p', null, 'No photos yet')
                        )
                    ) :
                    projectPhotos.map(photo =>
                        React.createElement('div', {
                            key: photo.id,
                            className: 'project-gallery-item'
                        },
                            React.createElement('img', {
                                src: photo.src,
                                alt: photo.name
                            }),
                            React.createElement('div', { className: 'project-gallery-overlay' },
                                React.createElement('button', {
                                    className: 'project-delete-btn',
                                    onClick: () => deletePhoto(photo.id)
                                },
                                    React.createElement('i', { className: 'fas fa-trash' })
                                )
                            )
                        )
                    )
            )
        )
    );
};

// Profile Photo Component
const ProfilePhoto = () => {
    const [profileSrc, setProfileSrc] = React.useState(null);

    React.useEffect(() => {
        const savedPhoto = localStorage.getItem('profilePhoto');
        if (savedPhoto) {
            setProfileSrc(savedPhoto);
        }
    }, []);

    const handlePhotoUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileSrc(e.target.result);
                localStorage.setItem('profilePhoto', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return React.createElement('div', { className: 'profile-container' },
        React.createElement('div', {
            className: 'profile-placeholder',
            id: 'profileImage'
        },
            profileSrc ?
                React.createElement('img', { src: profileSrc, alt: 'Profile Photo' }) :
                React.createElement('i', { className: 'fas fa-user' })
        ),
        React.createElement('div', { className: 'profile-upload' },
            React.createElement('input', {
                type: 'file',
                id: 'reactProfileInput',
                accept: 'image/*',
                style: { display: 'none' },
                onChange: handlePhotoUpload
            }),
            React.createElement('button', {
                className: 'upload-btn',
                onClick: () => document.getElementById('reactProfileInput').click()
            },
                React.createElement('i', { className: 'fas fa-camera' }),
                ' Upload Photo'
            )
        )
    );
};

// Main App Component
const PortfolioApp = () => {
    const [currentProjectGallery, setCurrentProjectGallery] = React.useState(null);

    React.useEffect(() => {
        // Setup project gallery links
        document.querySelectorAll('.gallery-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const projectName = e.target.closest('.gallery-link').dataset.project;
                setCurrentProjectGallery(projectName);
            });
        });
    }, []);

    return React.createElement('div', null,
        React.createElement(ProjectGallery, {
            projectName: currentProjectGallery,
            isOpen: !!currentProjectGallery,
            onClose: () => setCurrentProjectGallery(null)
        })
    );
};