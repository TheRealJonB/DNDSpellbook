import ammunitionData from '../data/fiveE/ammunitions.json';
import weaponPropertyData from '../data/fiveE/weaponproperties.json';
import weaponData from '../data/fiveE/weapons.json';
import { Ammunition, Weapon, WeaponProperty } from '../models/fiveE/Weapon';
import { getAmmunitionCount, getAmmunitionDataVersion, getWeaponCount, getWeaponDataVersion, getWeaponPropertyCount, getWeaponPropertyDataVersion, initAmmunitionTable, initWeaponPropertyTable, initWeaponTable, loadAmmunitionAll, loadAmmunitionById, loadWeaponById, loadWeaponPropertyAll, loadWeaponPropertyById, loadWeaponsAll, saveAmmunitions, saveWeaponProperties, saveWeapons, setAmmunitionDataVersion, setWeaponDataVersion, setWeaponPropertyDataVersion } from '../storage/weaponStorage';

const WEAPON_DATA_VERSION = 1;

export async function initializeWeapons() {
  await initWeaponTable();

  const count = await getWeaponCount();
  const storedVersion = await getWeaponDataVersion();

  if (count === 0 || storedVersion < WEAPON_DATA_VERSION) {
    // console.log('Seeding adventuring gear from JSON...');
    await saveWeapons(weaponData as Omit<Weapon, 'id'>[]);
    await setWeaponDataVersion(WEAPON_DATA_VERSION);
    // console.log('Adventuring Gear in database after seed:', await getWeaponCount());
    // console.log('Seeding complete');
  }
}

export async function initializeAmmunition() {
  await initAmmunitionTable();

  const count = await getAmmunitionCount();
  const storedVersion = await getAmmunitionDataVersion();

  if (count === 0 || storedVersion < WEAPON_DATA_VERSION) {
    // console.log('Seeding adventuring gear from JSON...');
    await saveAmmunitions(ammunitionData as Omit<Ammunition, 'id'>[]);
    await setAmmunitionDataVersion(WEAPON_DATA_VERSION);
    // console.log('Adventuring Gear in database after seed:', await getWeaponCount());
    // console.log('Seeding complete');
  }
}

export async function initializeWeaponProperties() {
  await initWeaponPropertyTable();

  const count = await getWeaponPropertyCount();
  const storedVersion = await getWeaponPropertyDataVersion();

  if (count === 0 || storedVersion < WEAPON_DATA_VERSION) {
    // console.log('Seeding adventuring gear from JSON...');
    await saveWeaponProperties(weaponPropertyData as Omit<WeaponProperty, 'id'>[]);
    await setWeaponPropertyDataVersion(WEAPON_DATA_VERSION);
    // console.log('Adventuring Gear in database after seed:', await getWeaponCount());
    // console.log('Seeding complete');
  }
}


export async function getWeaponAll(): Promise<Weapon[]> {
  return await loadWeaponsAll();
}

export async function getAmmunitionAll(): Promise<Ammunition[]> {
  return await loadAmmunitionAll();
}

export async function getWeaponPropertyAll(): Promise<WeaponProperty[]> {
  return await loadWeaponPropertyAll();
}


export async function getWeaponById(rowid: number): Promise<Weapon | null> {
  return await loadWeaponById(rowid);
}

export async function getAmmunitionById(rowid: number): Promise<Ammunition | null> {
  return await loadAmmunitionById(rowid);
}

export async function getWeaponPropertyById(rowid: number): Promise<WeaponProperty | null> {
  return await loadWeaponPropertyById(rowid);
}
