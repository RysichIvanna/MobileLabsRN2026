import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import {
  Directions,
  FlingGestureHandler,
  LongPressGestureHandler,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
  PinchGestureHandlerStateChangeEvent,
  State,
  TapGestureHandler,
  TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGame } from '../context/GameContext';

const AnimatedView = Animated.createAnimatedComponent(View);

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function Home() {
  const {
    addDoubleTap,
    addLongPressBonus,
    addPinchBonus,
    addSwipeBonus,
    addTap,
    doubleTapCount,
    dragCount,
    longPressCount,
    pinchCount,
    registerDrag,
    resetVersion,
    resolvedTheme,
    score,
    swipeLeftCount,
    swipeRightCount,
    tapCount,
    theme,
  } = useGame();
  const [isPressed, setIsPressed] = useState(false);
  const [lastReward, setLastReward] = useState('Комбінуй жести, щоб набирати більше очок.');

  const doubleTapRef = useRef<TapGestureHandler>(null);
  const panRef = useRef<PanGestureHandler>(null);
  const pinchRef = useRef<PinchGestureHandler>(null);
  const dragPosition = useRef(new Animated.ValueXY()).current;
  const baseScale = useRef(new Animated.Value(1)).current;
  const pinchScale = useRef(new Animated.Value(1)).current;
  const savedScale = useRef(1);

  useEffect(() => {
    dragPosition.setValue({ x: 0, y: 0 });
    dragPosition.setOffset({ x: 0, y: 0 });
    baseScale.setValue(1);
    pinchScale.setValue(1);
    savedScale.current = 1;
    setLastReward('Комбінуй жести, щоб набирати більше очок.');
  }, [baseScale, dragPosition, pinchScale, resetVersion]);

  const totalTouches = tapCount + doubleTapCount;

  const handleSingleTap = (event: TapGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.BEGAN) {
      setIsPressed(true);
    }

    if (event.nativeEvent.state === State.ACTIVE) {
      addTap();
      setLastReward('Коротке натискання: +1 очко');
    }

    if (
      event.nativeEvent.state === State.END ||
      event.nativeEvent.state === State.CANCELLED ||
      event.nativeEvent.state === State.FAILED
    ) {
      setIsPressed(false);
    }
  };

  const handleDoubleTap = (event: TapGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.BEGAN) {
      setIsPressed(true);
    }

    if (event.nativeEvent.state === State.ACTIVE) {
      addDoubleTap();
      setLastReward('Подвійний клік: +2 очки');
    }

    if (
      event.nativeEvent.state === State.END ||
      event.nativeEvent.state === State.CANCELLED ||
      event.nativeEvent.state === State.FAILED
    ) {
      setIsPressed(false);
    }
  };

  const handleLongPress = () => {
    addLongPressBonus();
    setLastReward('Довге утримання: +10 очок');
    setIsPressed(false);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    const reward = Math.floor(Math.random() * 8) + 3;
    addSwipeBonus(direction, reward);
    setLastReward(`Свайп ${direction === 'right' ? 'вправо' : 'вліво'}: +${reward} очок`);
  };

  const onPanGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: dragPosition.x,
          translationY: dragPosition.y,
        },
      },
    ],
    { useNativeDriver: false }
  ) as (event: PanGestureHandlerGestureEvent) => void;

  const handlePanStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.BEGAN) {
      dragPosition.extractOffset();
      dragPosition.setValue({ x: 0, y: 0 });
    }

    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX, translationY } = event.nativeEvent;
      const distance = Math.hypot(translationX, translationY);

      dragPosition.flattenOffset();

      if (distance > 30) {
        registerDrag();
        setLastReward('Перетягування зараховано');
      }
    }
  };

  const onPinchGestureEvent = Animated.event([{ nativeEvent: { scale: pinchScale } }], {
    useNativeDriver: false,
  }) as (event: PinchGestureHandlerGestureEvent) => void;

  const handlePinchStateChange = (event: PinchGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const nextScale = clamp(savedScale.current * event.nativeEvent.scale, 0.75, 1.8);
      const scaleDelta = Math.abs(nextScale - savedScale.current);

      baseScale.setValue(nextScale);
      pinchScale.setValue(1);

      if (scaleDelta >= 0.12) {
        addPinchBonus(6);
        setLastReward('Масштабування: +6 очок');
      }

      savedScale.current = nextScale;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />

      <View style={styles.screen}>
        <View style={[styles.heroCard, { backgroundColor: theme.panel, borderColor: theme.border }]}>
          <Text selectable={false} style={[styles.kicker, { color: theme.muted }]}>
            Гра-клікер \\ Rysich Ivanna
          </Text>
          <Text selectable={false} style={[styles.title, { color: theme.text }]}>
            Головний екран гри
          </Text>

          <View style={styles.scoreRow}>
            <View style={[styles.scoreBlock, { backgroundColor: theme.panelAlt }]}>
              <Text selectable={false} style={[styles.scoreLabel, { color: theme.muted }]}>
                Очки
              </Text>
              <Text selectable={false} style={[styles.scoreValue, { color: theme.text }]}>
                {score}
              </Text>
            </View>

            <View style={[styles.scoreBlock, { backgroundColor: theme.panelAlt }]}>
              <Text selectable={false} style={[styles.scoreLabel, { color: theme.muted }]}>
                Дотики
              </Text>
              <Text selectable={false} style={[styles.scoreValue, { color: theme.text }]}>
                {totalTouches}
              </Text>
            </View>
          </View>

          <Text selectable={false} style={[styles.helper, { color: theme.muted }]}>
            Короткий тап: +1. Подвійний тап: +2. Утримання 3 секунди: +10.
          </Text>
          <Text selectable={false} style={[styles.helper, { color: theme.muted }]}>
            Перетягуй, свайпай вліво або вправо та змінюй розмір обʼєкта для бонусів.
          </Text>
        </View>

        <View style={styles.playArea}>
          <PinchGestureHandler
            ref={pinchRef}
            simultaneousHandlers={panRef}
            onGestureEvent={onPinchGestureEvent}
            onHandlerStateChange={handlePinchStateChange}
          >
            <AnimatedView>
              <PanGestureHandler
                ref={panRef}
                simultaneousHandlers={pinchRef}
                onGestureEvent={onPanGestureEvent}
                onHandlerStateChange={handlePanStateChange}
              >
                <AnimatedView>
                  <FlingGestureHandler
                    direction={Directions.LEFT}
                    onActivated={() => handleSwipe('left')}
                  >
                    <AnimatedView>
                      <FlingGestureHandler
                        direction={Directions.RIGHT}
                        onActivated={() => handleSwipe('right')}
                      >
                        <AnimatedView>
                          <LongPressGestureHandler
                            minDurationMs={3000}
                            onActivated={handleLongPress}
                          >
                            <AnimatedView>
                              <TapGestureHandler
                                ref={doubleTapRef}
                                numberOfTaps={2}
                                maxDelayMs={260}
                                onHandlerStateChange={handleDoubleTap}
                              >
                                <AnimatedView>
                                  <TapGestureHandler
                                    waitFor={doubleTapRef}
                                    onHandlerStateChange={handleSingleTap}
                                  >
                                    <AnimatedView
                                      style={[
                                        styles.orbButton,
                                        {
                                          backgroundColor: theme.accent,
                                          borderColor: theme.accentStrong,
                                          shadowColor: theme.glow,
                                          transform: [
                                            { translateX: dragPosition.x },
                                            { translateY: dragPosition.y },
                                            { scale: Animated.multiply(baseScale, pinchScale) },
                                            { scale: isPressed ? 0.95 : 1 },
                                          ],
                                        },
                                      ]}
                                    >
                                      <View
                                        style={[styles.innerOrb, { backgroundColor: theme.glow }]}
                                      >
                                        <Text
                                          selectable={false}
                                          style={[styles.orbEmoji, { color: theme.text }]}
                                        >
                                          +очки
                                        </Text>
                                      </View>
                                    </AnimatedView>
                                  </TapGestureHandler>
                                </AnimatedView>
                              </TapGestureHandler>
                            </AnimatedView>
                          </LongPressGestureHandler>
                        </AnimatedView>
                      </FlingGestureHandler>
                    </AnimatedView>
                  </FlingGestureHandler>
                </AnimatedView>
              </PanGestureHandler>
            </AnimatedView>
          </PinchGestureHandler>
        </View>

        <View style={[styles.footerCard, { backgroundColor: theme.panel, borderColor: theme.border }]}>
          <Text selectable={false} style={[styles.footerTitle, { color: theme.text }]}>
            Остання дія
          </Text>
          <Text selectable={false} style={[styles.footerText, { color: theme.muted }]}>
            {lastReward}
          </Text>

          <View style={styles.statsRow}>
            <Text selectable={false} style={[styles.statItem, { color: theme.text }]}>
              Подвійні: {doubleTapCount}
            </Text>
            <Text selectable={false} style={[styles.statItem, { color: theme.text }]}>
              Утримання: {longPressCount}
            </Text>
          </View>
          <View style={styles.statsRow}>
            <Text selectable={false} style={[styles.statItem, { color: theme.text }]}>
              Свайп вліво: {swipeLeftCount}
            </Text>
            <Text selectable={false} style={[styles.statItem, { color: theme.text }]}>
              Свайп вправо: {swipeRightCount}
            </Text>
          </View>
          <View style={styles.statsRow}>
            <Text selectable={false} style={[styles.statItem, { color: theme.text }]}>
              Перетягування: {dragCount}
            </Text>
            <Text selectable={false} style={[styles.statItem, { color: theme.text }]}>
              Масштаб: {pinchCount}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  heroCard: {
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
  },
  kicker: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 18,
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },
  scoreBlock: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 30,
    fontWeight: '800',
  },
  helper: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 4,
  },
  playArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  orbButton: {
    width: 210,
    height: 210,
    borderRadius: 999,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.35,
    shadowRadius: 30,
    elevation: 16,
  },
  innerOrb: {
    width: 126,
    height: 126,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbEmoji: {
    fontSize: 28,
    fontWeight: '900',
  },
  footerCard: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    gap: 10,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  footerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statItem: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
});
