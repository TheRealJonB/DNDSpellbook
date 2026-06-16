import LoadingSpinner from '@/src/shared/components/ui/LoadingSpinner';
import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
    Dimensions,
    Pressable,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import PagerView from 'react-native-pager-view';
import Animated, {
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { LightSpell } from '../models/Spell';
import SpellCard from './SpellCard';


const { width: SCREEN_WIDTH } = Dimensions.get('window');


const SPELL_TABS = ['Cantrip', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'] as const;
const TAB_WIDTH = SCREEN_WIDTH / SPELL_TABS.length;
const NATIVE_SPRING_CONFIG = {
    damping: 20,     // Higher values reduce bounce/bounciness
    stiffness: 110,   // Higher values make the animation snappier
    mass: 1,         // Relative weight of the object moving
};

interface Props {
    groupedSpells: LightSpell[][];
}

export default function SpellList({ groupedSpells }: Props) {
    const router = useRouter();
    const pagerRef = useRef<PagerView>(null);
    const tabOffset = useSharedValue(0);

    // 1. Loading Trackers
    const [isUILoading, setIsUILoading] = useState(true);
    const [renderedTabsCount, setRenderedTabsCount] = useState(0);

    // Corrected layout hook signature
    const handleTabContentLayout = useCallback(() => {
        setRenderedTabsCount((prev) => {
            const nextCount = prev + 1;
            if (nextCount === SPELL_TABS.length) {
                requestAnimationFrame(() => {
                    setIsUILoading(false);
                });
            }
            return nextCount;
        }); // Fixed: Closed the state updater function cleanly here
    }, []); // The dependency array correctly sits out here

    // Derive the highlighted index directly from the bar's position
    const activeIndexDerived = useDerivedValue(() => {
        return Math.round(tabOffset.value / TAB_WIDTH);
    });

    const handleTabPress = (index: number): void => {
        // Slide the bar and the page at the exact same time
        tabOffset.value = withSpring(index * TAB_WIDTH, NATIVE_SPRING_CONFIG);
        pagerRef.current?.setPage(index);
    };

    const handlePageSelected = (e: any) => {
        const position = e.nativeEvent.position;

        // If swiping with a finger, animate the bar to catch up smoothly
        if (tabOffset.value !== position * TAB_WIDTH) {
            tabOffset.value = withSpring(position * TAB_WIDTH, NATIVE_SPRING_CONFIG);
        }
    };

    const animatedIndicatorStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: tabOffset.value }],
    }));

    const handleSpellPress = useCallback((spell: LightSpell) => {
        router.push(`/(tabs)/library/${spell.rowid}`);
    }, [router]);

    return (
        <View style={styles.container}>
            {isUILoading && (
                <View style={StyleSheet.absoluteFill}>
                    <LoadingSpinner message="Loading spells..." />
                </View>
            )}
            {/* Tab Container */}
            <View style={[styles.tabBarContainer, { opacity: isUILoading ? 0 : 1 }]}>
                <View style={styles.tabBar}>
                    {SPELL_TABS.map((tabName, index) => {
                        return (
                            <TabItem
                                key={tabName}
                                tabName={tabName}
                                index={index}
                                activeIndexDerived={activeIndexDerived}
                                onPress={() => handleTabPress(index)}
                            />
                        );
                    })}
                </View>
                {/* The Smooth Animated Sliding Line */}
                <Animated.View style={[styles.indicator, animatedIndicatorStyle]} />
            </View>
            <PagerView
                ref={pagerRef}
                style={{ flex: 1 }}
                initialPage={0}
                onPageSelected={handlePageSelected}
            >
                {groupedSpells.map((spells, index) => {

                    return (
                        <View key={SPELL_TABS[index]} style={styles.page} collapsable={false}>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                removeClippedSubviews={true} // huh?
                                // "never" will close keyboard, components below will not receive tap
                                //  "handled" only does if you tap something that handles that tap
                                // "always" keeps keyboard up, and component below receives tap
                                keyboardShouldPersistTaps="never"
                                // contentContainerStyle={styles.listContent}
                                onLayout={handleTabContentLayout}

                            >
                                {spells.map((spell) => (
                                    <SpellCard
                                        key={spell.rowid} // Fixed: Swapped name key for rowid to ensure uniqueness
                                        spell={spell}
                                        onPress={handleSpellPress}
                                    />
                                ))}
                            </ScrollView>

                        </View>
                    );
                })}
            </PagerView>
        </View>
    );
}


// 💡 Native Tab Item Wrapper Component
function TabItem({ tabName, index, activeIndexDerived, onPress }: any) {
    const animatedTextStyle = useAnimatedStyle(() => {
        const isSelected = activeIndexDerived.value === index;
        return {
            color: withTiming(isSelected ? '#007AFF' : '#666', { duration: 200 }),
            fontWeight: isSelected ? '700' : '500',
        };
    });

    return (
        <Pressable style={styles.tabItem} onPress={onPress}>
            <Animated.Text style={[styles.tabText, animatedTextStyle]}>
                {tabName}
            </Animated.Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabBarContainer: {
        position: 'relative',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        // backgroundColor: '#fff',
    },
    tabBar: {
        flexDirection: 'row',
    },
    tabItem: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#666',
    },
    activeTabText: {
        color: '#007AFF',
        fontWeight: '700',
    },
    // activeTabItem: {
    //     borderBottomWidth: 3,
    //     borderBottomColor: '#007AFF',
    // },
    // tab: {
    //     flex: 1, paddingVertical: 15, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent'
    // },
    // activeTab: {
    //     borderBottomColor: '#800000'
    // },
    // 💡 Style for the absolute sliding indicator line
    indicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 3,
        width: TAB_WIDTH,
        backgroundColor: '#007AFF',
        borderRadius: 3,
    },
    //   tabText: { 
    //     color: '#666', fontWeight: '600', fontSize: 13
    //  },
    //   activeTabText: { 
    //     color: '#800000'
    //  },
    page: {
        width: SCREEN_WIDTH,
        flex: 1
    },
    spellCard: {
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 12,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41
    },
});
