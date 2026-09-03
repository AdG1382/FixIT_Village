import React, { useState, useEffect } from 'react';
import { socket, getOrCreatePlayerId, getSavedNickname, saveNickname } from './socket';
import { PortfolioHomePage } from './components/PortfolioHomePage';
import { MathaPacchiPage } from './components/MathaPacchiPage';
import { FixitPage } from './components/FixitPage';
import { LobbyView } from './components/LobbyView';
import { Scoreboard } from './components/Scoreboard';
import { PhaseBanner } from './components/PhaseBanner';
import { VillageBoard } from './components/VillageBoard';
import { PlayerHand } from './components/PlayerHand';
import { VotingPanel } from './components/VotingPanel';
import { CardModal } from './components/CardModal';
import { RulebookModal } from './components/RulebookModal';
import { HostControlsModal } from './components/HostControlsModal';
import { ActivityLogModal } from './components/ActivityLogModal';
import { StatisticsModal } from './components/StatisticsModal';
import { ChangelogModal } from './components/ChangelogModal';
import { FeedbackModal } from './components/FeedbackModal';
import { GameOverModal } from './components/GameOverModal';
import { SpecialCardPlayModal } from './components/SpecialCardPlayModal';

export function App() {
  const [playerId] = useState(getOrCreatePlayerId);
  const [nickname, setNickname] = useState(getSavedNickname);
  const [room, setRoom] = useState(null);
  const [socketConnected, setSocketConnected] = useState(socket.connected);

  // Pathname routing (/ , /matha-pacchi, /fixit)
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  useEffect(() => {
    const onPopState = () => {
      if (typeof window !== 'undefined') {
        setCurrentPath(window.location.pathname);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigateTo = (path) => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
      setCurrentPath(path);
      window.scrollTo(0, 0);
    }
  };

  // Parse URL query parameter for room code (e.g. ?room=ABCD12)
  const [urlRoomCode] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('room') || params.get('join') || params.get('code') || '';
    }
    return '';
  });

  // If a join room query parameter is present on the root path /, redirect to /fixit?room=CODE
  useEffect(() => {
    if (urlRoomCode && currentPath === '/') {
      navigateTo(`/fixit?room=${urlRoomCode}`);
    }
  }, [urlRoomCode, currentPath]);

  // Turn interaction selection states
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedToolIds, setSelectedToolIds] = useState([]);

  // Modals
  const [inspectCard, setInspectCard] = useState(null);
  const [playSpecialCardTarget, setPlaySpecialCardTarget] = useState(null);
  const [showRules, setShowRules] = useState(false);
  const [showHostControls, setShowHostControls] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Helpers to manage draft selections in sessionStorage
  const clearDraftSelections = (roomCode) => {
    try {
      if (roomCode) {
        sessionStorage.removeItem(`fixit_draft_${roomCode}_req`);
        sessionStorage.removeItem(`fixit_draft_${roomCode}_tools`);
      }
    } catch (e) {}
  };

  // Reconnection and socket lifecycle
  useEffect(() => {
    const attemptReconnect = () => {
      const savedRoomCode = sessionStorage.getItem('fixit_current_room') || localStorage.getItem('fixit_current_room');
      if (savedRoomCode && playerId) {
        socket.emit('reconnect_session', { roomCode: savedRoomCode, playerId }, (res) => {
          if (res?.success && res.room) {
            setRoom(res.room);
            sessionStorage.setItem('fixit_current_room', res.room.code);
            localStorage.setItem('fixit_current_room', res.room.code);
          } else {
            sessionStorage.removeItem('fixit_current_room');
            localStorage.removeItem('fixit_current_room');
            clearDraftSelections(savedRoomCode);
            setRoom(null);
          }
        });
      }
    };

    const onConnect = () => {
      setSocketConnected(true);
      attemptReconnect();
    };

    const onDisconnect = () => setSocketConnected(false);

    const onRoomState = (updatedRoom) => {
      setRoom(updatedRoom);
      if (updatedRoom?.code) {
        sessionStorage.setItem('fixit_current_room', updatedRoom.code);
        localStorage.setItem('fixit_current_room', updatedRoom.code);
      }

      if (updatedRoom.phase === 'PLAYER_TURN') {
        const isMyTurn = updatedRoom.currentPlayer?.id === playerId;
        if (isMyTurn) {
          try {
            const savedReq = sessionStorage.getItem(`fixit_draft_${updatedRoom.code}_req`);
            const savedTools = sessionStorage.getItem(`fixit_draft_${updatedRoom.code}_tools`);
            if (savedReq && updatedRoom.boardRequests?.some(r => r.id === savedReq)) {
              setSelectedRequestId(savedReq);
            }
            if (savedTools) {
              const parsed = JSON.parse(savedTools);
              if (Array.isArray(parsed)) setSelectedToolIds(parsed);
            }
          } catch (e) {}
        } else {
          setSelectedRequestId(null);
          setSelectedToolIds([]);
          clearDraftSelections(updatedRoom.code);
        }
      } else {
        setSelectedRequestId(null);
        setSelectedToolIds([]);
        if (updatedRoom.phase === 'TURN_RESULT' || updatedRoom.phase === 'GAME_OVER') {
          clearDraftSelections(updatedRoom?.code);
        }
      }
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('room_state', onRoomState);

    if (socket.connected) {
      attemptReconnect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('room_state', onRoomState);
    };
  }, [playerId]);

  // Actions
  const handleCreateRoom = (nick, targetScore) => {
    setNickname(nick);
    saveNickname(nick);
    socket.emit('create_room', { hostId: playerId, nickname: nick, targetScore, theme: 'village' }, (res) => {
      if (res?.success && res.room) {
        setRoom(res.room);
        sessionStorage.setItem('fixit_current_room', res.room.code);
        localStorage.setItem('fixit_current_room', res.room.code);
        navigateTo('/fixit');
      } else {
        alert(res?.error || 'Failed to create room');
      }
    });
  };

  const handleJoinRoom = (code, nick) => {
    setNickname(nick);
    saveNickname(nick);
    socket.emit('join_room', { roomCode: code, playerId, nickname: nick }, (res) => {
      if (res?.success && res.room) {
        setRoom(res.room);
        sessionStorage.setItem('fixit_current_room', res.room.code);
        localStorage.setItem('fixit_current_room', res.room.code);
        navigateTo('/fixit');
      } else {
        alert(res?.error || 'Failed to join room');
      }
    });
  };

  const handleStartGame = () => {
    if (!room) return;
    socket.emit('start_game', { roomCode: room.code, hostId: playerId }, (res) => {
      if (!res?.success) alert(res?.error || 'Failed to start game');
    });
  };

  const handleLeaveRoom = () => {
    if (room?.code) {
      socket.emit('leave_room', { roomCode: room.code, playerId });
      sessionStorage.removeItem('fixit_current_room');
      localStorage.removeItem('fixit_current_room');
      clearDraftSelections(room.code);
    }
    setRoom(null);
  };

  const handleSelectRequest = (reqId) => {
    if (selectedRequestId === reqId) {
      setSelectedRequestId(null);
      if (room?.code) sessionStorage.removeItem(`fixit_draft_${room.code}_req`);
    } else {
      setSelectedRequestId(reqId);
      if (room?.code) sessionStorage.setItem(`fixit_draft_${room.code}_req`, reqId);
    }
  };

  const handleToggleTool = (toolId) => {
    let next;
    if (selectedToolIds.includes(toolId)) {
      next = selectedToolIds.filter((id) => id !== toolId);
    } else {
      next = [...selectedToolIds, toolId];
    }
    setSelectedToolIds(next);
    if (room?.code) sessionStorage.setItem(`fixit_draft_${room.code}_tools`, JSON.stringify(next));
  };

  const handleSubmitTurn = () => {
    if (!selectedRequestId || selectedToolIds.length === 0) return;
    socket.emit(
      'submit_turn',
      { roomCode: room.code, playerId, requestId: selectedRequestId, toolIds: selectedToolIds },
      (res) => {
        if (res?.success) {
          clearDraftSelections(room.code);
        } else {
          alert(res?.error || 'Failed to submit story');
        }
      }
    );
  };

  const handleToggleObjection = () => {
    socket.emit('toggle_objection', { roomCode: room.code, playerId });
  };

  const handleFinishStory = () => {
    socket.emit('finish_story', { roomCode: room.code, playerId });
  };

  const handleProceedToVote = () => {
    socket.emit('proceed_to_vote', { roomCode: room.code, hostId: playerId });
  };

  const handleCastVote = (vote) => {
    socket.emit('cast_vote', { roomCode: room.code, playerId, vote });
  };

  const handleAdvanceTurn = () => {
    socket.emit('advance_turn', { roomCode: room.code });
  };

  const handleHostAction = (action, params) => {
    socket.emit('host_action', { roomCode: room.code, hostId: playerId, action, params });
  };

  const handlePlaySpecialCard = (specialCardId, payload) => {
    socket.emit(
      'play_special_card',
      { roomCode: room.code, playerId, specialCardId, payload },
      (res) => {
        if (!res?.success) alert(res?.error || 'Failed to play special card');
      }
    );
  };

  // View state helpers
  const me = room?.players.find((p) => p.id === playerId);
  const myHand = me?.hand || [];
  const isMyTurn = room?.currentPlayer?.id === playerId;
  const canSubmitTurn = Boolean(selectedRequestId && selectedToolIds.length > 0);
  const objectionCount = room?.objections ? Object.keys(room.objections).length : 0;

  // Banner helper if player is in an active FixIT match while browsing / or /matha-pacchi
  const renderActiveRoomBanner = () => {
    if (!room || currentPath.startsWith('/fixit')) return null;
    return (
      <div style={{
        background: '#10b981',
        color: '#ffffff',
        padding: '8px 16px',
        textAlign: 'center',
        fontWeight: 800,
        fontSize: '0.88rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.6rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <span>🎮 Active FixIT Match in Room <strong>{room.code}</strong></span>
        <button
          onClick={() => navigateTo('/fixit')}
          style={{
            background: '#ffffff',
            color: '#065f46',
            border: 'none',
            borderRadius: '9999px',
            padding: '3px 12px',
            fontWeight: 900,
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          Return to Game →
        </button>
      </div>
    );
  };

  // ROUTE 1: Dedicated Maatha Pacchi Page (/matha-pacchi or /mathapacchi)
  if (currentPath.startsWith('/matha-pacchi') || currentPath.startsWith('/mathapacchi')) {
    return (
      <>
        {renderActiveRoomBanner()}
        <MathaPacchiPage
          onNavigateHome={() => navigateTo('/')}
        />
      </>
    );
  }

  // ROUTE 0: Root Studio Portfolio Page (/)
  if (currentPath === '/' || currentPath === '') {
    return (
      <>
        {renderActiveRoomBanner()}
        <PortfolioHomePage
          onNavigateMathaPacchi={() => navigateTo('/matha-pacchi')}
          onNavigateFixit={() => navigateTo('/fixit')}
        />
      </>
    );
  }

  // ROUTE 2: Dedicated FixIT Page (/fixit) — Active Game Room or Pre-game Landing & Stats
  if (currentPath.startsWith('/fixit')) {
    // If no active room in socket engine, render Fixit Landing Page with Create/Join Form & Stats
    if (!room) {
      return (
        <FixitPage
          initialNickname={nickname}
          initialRoomCode={urlRoomCode}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          onNavigateHome={() => navigateTo('/')}
        />
      );
    }

    // Active Game Lobby View inside /fixit
    if (room.phase === 'LOBBY') {
      return (
        <>
          <LobbyView
            room={room}
            onStartGame={handleStartGame}
            onLeaveRoom={handleLeaveRoom}
            onOpenRules={() => setShowRules(true)}
            onOpenHostControls={() => setShowHostControls(true)}
            onOpenFeedback={() => setShowFeedback(true)}
          />
          {showRules && <RulebookModal onClose={() => setShowRules(false)} />}
          {showHostControls && (
            <HostControlsModal
              room={room}
              onClose={() => setShowHostControls(false)}
              onHostAction={handleHostAction}
            />
          )}
          {showFeedback && (
            <FeedbackModal
              gameId={room.gameId}
              playerId={playerId}
              nickname={nickname}
              onClose={() => setShowFeedback(false)}
            />
          )}
        </>
      );
    }

    // Active Game Tabletop View inside /fixit
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'space-between' }}>
        <Scoreboard
          room={room}
          onLeaveRoom={handleLeaveRoom}
          onOpenRules={() => setShowRules(true)}
          onOpenHostControls={() => setShowHostControls(true)}
          onOpenActivityLog={() => setShowActivityLog(true)}
          onOpenStats={() => setShowStats(true)}
          onOpenChangelog={() => setShowChangelog(true)}
          onOpenFeedback={() => setShowFeedback(true)}
        />

        <PhaseBanner
          phase={room.phase}
          isMyTurn={isMyTurn}
          currentPlayer={room.currentPlayer}
          onFinishStory={handleFinishStory}
          onProceedToVote={handleProceedToVote}
          onAdvanceTurn={handleAdvanceTurn}
          isViewerHost={room.isViewerHost}
          lastTurnResult={room.lastTurnResult}
          objectionCount={objectionCount}
        />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '1rem 0' }}>
          {['DISCUSSION', 'VOTING'].includes(room.phase) && (
            <VotingPanel
              phase={room.phase}
              isMyTurn={isMyTurn}
              viewerPlayerId={playerId}
              players={room.players.map((p) => ({
                ...p,
                isCurrent: p.id === room.currentPlayer?.id
              }))}
              objections={room.objections}
              votes={room.votes}
              onToggleObjection={handleToggleObjection}
              onCastVote={handleCastVote}
            />
          )}

          <VillageBoard
            boardRequests={room.boardRequests}
            activeRequest={room.activeRequest}
            extraRequest={room.extraRequest}
            wildToolMapping={room.wildToolMapping}
            borrowedTool={room.borrowedTool}
            selectedRequestId={selectedRequestId}
            onSelectRequest={handleSelectRequest}
            onInspectCard={(c) => setInspectCard(c)}
            phase={room.phase}
            isMyTurn={isMyTurn}
            playedToolCards={room.playedToolCards}
          />
        </main>

        <PlayerHand
          hand={myHand}
          selectedToolIds={selectedToolIds}
          onToggleTool={handleToggleTool}
          onInspectCard={(c) => setInspectCard(c)}
          onPlaySpecial={(c) => setPlaySpecialCardTarget(c)}
          playedSpecialCardId={room.playedSpecialCardId}
          phase={room.phase}
          isMyTurn={isMyTurn}
          canSubmitTurn={canSubmitTurn}
          onSubmitTurn={handleSubmitTurn}
        />

        {inspectCard && (
          <CardModal card={inspectCard} onClose={() => setInspectCard(null)} />
        )}

        {playSpecialCardTarget && (
          <SpecialCardPlayModal
            card={playSpecialCardTarget}
            room={room}
            playerId={playerId}
            onClose={() => setPlaySpecialCardTarget(null)}
            onConfirmPlay={handlePlaySpecialCard}
          />
        )}

        {showRules && (
          <RulebookModal onClose={() => setShowRules(false)} />
        )}

        {showHostControls && (
          <HostControlsModal
            room={room}
            onClose={() => setShowHostControls(false)}
            onHostAction={handleHostAction}
          />
        )}

        {showActivityLog && (
          <ActivityLogModal
            activityLog={room.activityLog}
            onClose={() => setShowActivityLog(false)}
          />
        )}

        {showStats && (
          <StatisticsModal onClose={() => setShowStats(false)} />
        )}

        {showChangelog && (
          <ChangelogModal onClose={() => setShowChangelog(false)} />
        )}

        {showFeedback && (
          <FeedbackModal
            gameId={room.gameId}
            playerId={playerId}
            nickname={nickname}
            onClose={() => setShowFeedback(false)}
          />
        )}

        {room.phase === 'GAME_OVER' && (
          <GameOverModal
            room={room}
            isHost={room.isViewerHost}
            onRestartGame={() => handleHostAction('restartGame')}
            onReturnToLobby={handleLeaveRoom}
            onOpenFeedback={() => setShowFeedback(true)}
          />
        )}
      </div>
    );
  }

  // Fallback default: Root Studio Portfolio Page
  return (
    <PortfolioHomePage
      onNavigateMathaPacchi={() => navigateTo('/matha-pacchi')}
      onNavigateFixit={() => navigateTo('/fixit')}
    />
  );
}

export default App;
