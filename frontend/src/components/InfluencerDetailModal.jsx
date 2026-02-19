const InfluencerDetailModal = ({ isOpen, onClose, influencer }) => {
  if (!isOpen || !influencer) return null;

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <>
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          overflowY: 'auto'
        }}
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            animation: 'slideUp 0.3s ease',
            position: 'relative'
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              fontSize: '1.5rem',
              zIndex: 1,
              transition: 'all 0.2s'
            }}
          >
            ×
          </button>

          <div style={{
            padding: '2rem',
            borderBottom: '1px solid var(--border)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '1.5rem',
              left: '1.5rem',
              background: influencer.platform === 'YOUTUBE' ? '#FF0000' : '#E4405F',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {influencer.platform}
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '0.5rem'
              }}>
                {influencer.fullName}
              </h2>
              <p style={{
                fontSize: '1.1rem',
                color: 'var(--text-muted)',
                marginBottom: '1rem'
              }}>
                @{influencer.username}
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            padding: '2rem',
            background: 'var(--bg-primary)',
            borderBottom: '1px solid var(--border)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Followers</p>
              <p style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: 'var(--gold)'
              }}>
                {formatNumber(influencer.followerCount)}
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Following</p>
              <p style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: 'var(--text-primary)'
              }}>
                {formatNumber(influencer.followingCount || 0)}
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Posts</p>
              <p style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: 'var(--text-primary)'
              }}>
                {formatNumber(influencer.postsCount || 0)}
              </p>
            </div>
          </div>

          <div style={{ padding: '2rem' }}>
            {influencer.bio && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Bio</h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6'
                }}>
                  {influencer.bio}
                </p>
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.5rem'
            }}>
              {influencer.email && (
                <div>
                  <p style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.25rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Email</p>
                  <p style={{
                    fontSize: '0.95rem',
                    color: 'var(--text-primary)',
                    fontWeight: '500'
                  }}>{influencer.email}</p>
                </div>
              )}

              {influencer.website && (
                <div>
                  <p style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.25rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Website</p>
                  <a 
                    href={influencer.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '0.95rem',
                      color: 'var(--gold)',
                      fontWeight: '500',
                      textDecoration: 'none'
                    }}
                  >
                    {influencer.website}
                  </a>
                </div>
              )}

              {influencer.locationCity && (
                <div>
                  <p style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.25rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Location</p>
                  <p style={{
                    fontSize: '0.95rem',
                    color: 'var(--text-primary)',
                    fontWeight: '500'
                  }}>
                    {influencer.locationCity}{influencer.locationCountry && `, ${influencer.locationCountry}`}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div style={{
            padding: '1.5rem 2rem',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-primary)'
          }}>
            <button
              onClick={onClose}
              style={{
                width: '100%',
                background: 'var(--gold)',
                color: 'var(--bg-primary)',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfluencerDetailModal;
