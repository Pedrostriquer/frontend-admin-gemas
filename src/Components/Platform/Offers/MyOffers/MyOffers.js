import React from "react";
import styles from "./MyOffersStyle";

const MyOffers = ({ offers, categories, onEdit, onDelete, onToggleStatus }) => {
  const getStatusBadge = (status) => {
    if (status === 2) {
      return (
        <span style={{ ...styles.statusBadge, ...styles.statusBadgeActive }}>
          <i className="fa-solid fa-circle"></i> Ativo
        </span>
      );
    }
    return (
      <span style={{ ...styles.statusBadge, ...styles.statusBadgePaused }}>
        <i className="fa-solid fa-circle"></i> Pausado
      </span>
    );
  };

  return (
    <div style={styles.myOffersContainer}>
      {offers.length === 0 ? (
        <div style={styles.noOffersContainer}>
          <i
            className="fa-solid fa-folder-open"
            style={styles.noOffersIcon}
          ></i>
          <h2 style={styles.noOffersTitle}>Nenhum anúncio encontrado</h2>
          <p style={styles.noOffersText}>
            Parece que você ainda não criou nenhum anúncio. Comece agora na tela
            de criação!
          </p>
        </div>
      ) : (
        <div style={styles.offersGrid}>
          {offers.map((offer) => {
            const isPaused = offer.status !== 2;
            return (
              <div
                key={offer.id}
                style={{
                  ...styles.offerCard,
                  ...(isPaused && styles.offerCardPaused),
                }}
              >
                <div style={styles.mediaContainer}>
                  {offer.mideaType === 2 ? (
                    <video
                      src={offer.mideaUrl}
                      style={styles.mediaContent}
                      controls
                      muted
                      loop
                    />
                  ) : (
                    <img
                      src={offer.mideaUrl}
                      alt={offer.title}
                      style={styles.mediaContent}
                    />
                  )}
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.cardHeaderRow}>
                    <span style={styles.categoryBadge}>
                      {offer.categoryName}
                    </span>
                    {getStatusBadge(offer.status)}
                  </div>
                  <h3 style={styles.cardTitle}>{offer.title}</h3>
                  <p style={styles.cardDescription}>{offer.description}</p>
                </div>
                <div style={styles.cardFooter}>
                  {offer.status === 2 ? (
                    <button
                      onClick={() => onToggleStatus(offer.id)}
                      style={{ ...styles.actionButton, ...styles.pauseButton }}
                    >
                      <i className="fa-solid fa-pause"></i> Pausar
                    </button>
                  ) : (
                    <button
                      onClick={() => onToggleStatus(offer.id)}
                      style={{
                        ...styles.actionButton,
                        ...styles.activateButton,
                      }}
                    >
                      <i className="fa-solid fa-play"></i> Reativar
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(offer)}
                    style={{ ...styles.actionButton, ...styles.editButton }}
                  >
                    <i className="fa-solid fa-pencil"></i> Editar
                  </button>
                  <button
                    onClick={() => onDelete(offer.id)}
                    style={{ ...styles.actionButton, ...styles.deleteButton }}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOffers;
