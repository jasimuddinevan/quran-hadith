import React, { useState } from 'react';
import { Star, Search, Copy, Volume2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Name {
  number: number;
  arabic: string;
  transliteration: string;
  english: string;
  bengali: string;
  meaningEn: string;
  meaningBn: string;
}

const namesOfAllah: Name[] = [
  { number: 1, arabic: 'الرَّحْمَنُ', transliteration: 'Ar-Rahman', english: 'The Most Gracious', bengali: 'পরম করুণাময়', meaningEn: 'The One who has plenty of mercy for the believers and the blasphemers in this world.', meaningBn: 'যিনি দুনিয়ায় বিশ্বাসী ও অবিশ্বাসী সকলের প্রতি করুণাময়।' },
  { number: 2, arabic: 'الرَّحِيمُ', transliteration: 'Ar-Raheem', english: 'The Most Merciful', bengali: 'অসীম দয়ালু', meaningEn: 'The One who has plenty of mercy for the believers in this world and in the Hereafter.', meaningBn: 'যিনি দুনিয়া ও আখিরাতে বিশ্বাসীদের প্রতি অসীম দয়ালু।' },
  { number: 3, arabic: 'الْمَلِكُ', transliteration: 'Al-Malik', english: 'The King', bengali: 'বাদশাহ', meaningEn: 'The One with the complete Dominion, the One Whose Dominion is clear from imperfection.', meaningBn: 'সম্পূর্ণ সার্বভৌমত্বের অধিকারী, যাঁর রাজত্ব ত্রুটিমুক্ত।' },
  { number: 4, arabic: 'الْقُدُّوسُ', transliteration: 'Al-Quddus', english: 'The Most Holy', bengali: 'পবিত্রতম', meaningEn: 'The One who is pure from any imperfection and clear from children and adversaries.', meaningBn: 'যিনি সকল অপূর্ণতা থেকে পবিত্র।' },
  { number: 5, arabic: 'السَّلاَمُ', transliteration: 'As-Salam', english: 'The Source of Peace', bengali: 'শান্তিদাতা', meaningEn: 'The One who is free from every imperfection.', meaningBn: 'যিনি সকল ত্রুটি থেকে মুক্ত।' },
  { number: 6, arabic: 'الْمُؤْمِنُ', transliteration: 'Al-Mu\'min', english: 'The Guardian of Faith', bengali: 'নিরাপত্তা দানকারী', meaningEn: 'The One who witnessed for Himself that no one is God but Him.', meaningBn: 'যিনি নিজের জন্য সাক্ষ্য দেন যে তিনি ছাড়া কোনো উপাস্য নেই।' },
  { number: 7, arabic: 'الْمُهَيْمِنُ', transliteration: 'Al-Muhaymin', english: 'The Protector', bengali: 'রক্ষাকর্তা', meaningEn: 'The One who witnesses the saying and deeds of His creatures.', meaningBn: 'যিনি তাঁর সৃষ্টির কথা ও কাজের সাক্ষী।' },
  { number: 8, arabic: 'الْعَزِيزُ', transliteration: 'Al-Aziz', english: 'The Almighty', bengali: 'মহাপরাক্রমশালী', meaningEn: 'The Defeater who is not defeated.', meaningBn: 'যিনি পরাজিত হন না এমন বিজয়ী।' },
  { number: 9, arabic: 'الْجَبَّارُ', transliteration: 'Al-Jabbar', english: 'The Compeller', bengali: 'মহাশক্তিমান', meaningEn: 'The One that nothing happens in His Dominion except that which He willed.', meaningBn: 'যাঁর রাজ্যে তাঁর ইচ্ছা ছাড়া কিছুই ঘটে না।' },
  { number: 10, arabic: 'الْمُتَكَبِّرُ', transliteration: 'Al-Mutakabbir', english: 'The Supreme', bengali: 'মহিমান্বিত', meaningEn: 'The One who is clear from the attributes of the creatures.', meaningBn: 'যিনি সৃষ্টির গুণাবলী থেকে পবিত্র।' },
  { number: 11, arabic: 'الْخَالِقُ', transliteration: 'Al-Khaliq', english: 'The Creator', bengali: 'সৃষ্টিকর্তা', meaningEn: 'The One who brings everything from non-existence to existence.', meaningBn: 'যিনি সবকিছুকে অস্তিত্বহীনতা থেকে অস্তিত্বে আনেন।' },
  { number: 12, arabic: 'الْبَارِئُ', transliteration: 'Al-Bari\'', english: 'The Maker', bengali: 'নির্মাতা', meaningEn: 'The Creator who has the Power to turn the entities.', meaningBn: 'সৃষ্টিকর্তা যাঁর সত্তাগুলোকে পরিবর্তন করার ক্ষমতা আছে।' },
  { number: 13, arabic: 'الْمُصَوِّرُ', transliteration: 'Al-Musawwir', english: 'The Fashioner', bengali: 'আকৃতিদাতা', meaningEn: 'The One who forms His creatures in different pictures.', meaningBn: 'যিনি তাঁর সৃষ্টিকে বিভিন্ন আকৃতিতে গঠন করেন।' },
  { number: 14, arabic: 'الْغَفَّارُ', transliteration: 'Al-Ghaffar', english: 'The Forgiver', bengali: 'ক্ষমাশীল', meaningEn: 'The One who forgives the sins of His slaves time and time again.', meaningBn: 'যিনি বান্দাদের পাপ বারবার ক্ষমা করেন।' },
  { number: 15, arabic: 'الْقَهَّارُ', transliteration: 'Al-Qahhar', english: 'The Subduer', bengali: 'প্রবল', meaningEn: 'The One who has the perfect Power and is not unable over anything.', meaningBn: 'যাঁর পূর্ণ ক্ষমতা আছে এবং যিনি কোনো কিছুতে অক্ষম নন।' },
  { number: 16, arabic: 'الْوَهَّابُ', transliteration: 'Al-Wahhab', english: 'The Bestower', bengali: 'মহাদাতা', meaningEn: 'The One who is Generous in giving plenty without any return.', meaningBn: 'যিনি প্রতিদান ছাড়াই প্রচুর দানে উদার।' },
  { number: 17, arabic: 'الرَّزَّاقُ', transliteration: 'Ar-Razzaq', english: 'The Provider', bengali: 'রিযিকদাতা', meaningEn: 'The One who gives everything that benefits.', meaningBn: 'যিনি উপকারী সবকিছু দান করেন।' },
  { number: 18, arabic: 'الْفَتَّاحُ', transliteration: 'Al-Fattah', english: 'The Opener', bengali: 'বিজয়দানকারী', meaningEn: 'The One who opens for His slaves the closed worldly and religious matters.', meaningBn: 'যিনি বান্দাদের জন্য বন্ধ দুনিয়াবী ও ধর্মীয় বিষয় খুলে দেন।' },
  { number: 19, arabic: 'الْعَلِيمُ', transliteration: 'Al-Alim', english: 'The All-Knowing', bengali: 'সর্বজ্ঞ', meaningEn: 'The One who nothing is absent from His knowledge.', meaningBn: 'যাঁর জ্ঞান থেকে কিছুই অনুপস্থিত নয়।' },
  { number: 20, arabic: 'الْقَابِضُ', transliteration: 'Al-Qabid', english: 'The Constrictor', bengali: 'সংকোচনকারী', meaningEn: 'The One who constricts the sustenance.', meaningBn: 'যিনি রিযিক সংকুচিত করেন।' },
  { number: 21, arabic: 'الْبَاسِطُ', transliteration: 'Al-Basit', english: 'The Expander', bengali: 'প্রসারণকারী', meaningEn: 'The One who expands and gives generously.', meaningBn: 'যিনি প্রসারিত করেন এবং উদারভাবে দান করেন।' },
  { number: 22, arabic: 'الْخَافِضُ', transliteration: 'Al-Khafid', english: 'The Abaser', bengali: 'অবনতকারী', meaningEn: 'The One who lowers whoever He willed by His Destruction.', meaningBn: 'যিনি যাকে চান তাঁর ধ্বংসের মাধ্যমে নিচু করেন।' },
  { number: 23, arabic: 'الرَّافِعُ', transliteration: 'Ar-Rafi\'', english: 'The Exalter', bengali: 'উন্নতকারী', meaningEn: 'The One who raises whoever He willed by His Endowment.', meaningBn: 'যিনি যাকে চান তাঁর দানের মাধ্যমে উন্নত করেন।' },
  { number: 24, arabic: 'الْمُعِزُّ', transliteration: 'Al-Mu\'izz', english: 'The Giver of Honor', bengali: 'সম্মানদাতা', meaningEn: 'The One who gives esteem to whoever He willed.', meaningBn: 'যিনি যাকে চান সম্মান দান করেন।' },
  { number: 25, arabic: 'الْمُذِلُّ', transliteration: 'Al-Mudhill', english: 'The Giver of Dishonor', bengali: 'অপমানকারী', meaningEn: 'The One who humiliates whoever He willed.', meaningBn: 'যিনি যাকে চান অপমানিত করেন।' },
  { number: 26, arabic: 'السَّمِيعُ', transliteration: 'As-Sami\'', english: 'The All-Hearing', bengali: 'সর্বশ্রোতা', meaningEn: 'The One who Hears all things that are heard.', meaningBn: 'যিনি সব শ্রবণযোগ্য জিনিস শোনেন।' },
  { number: 27, arabic: 'الْبَصِيرُ', transliteration: 'Al-Basir', english: 'The All-Seeing', bengali: 'সর্বদ্রষ্টা', meaningEn: 'The One who Sees all things that are seen.', meaningBn: 'যিনি সব দৃশ্যমান জিনিস দেখেন।' },
  { number: 28, arabic: 'الْحَكَمُ', transliteration: 'Al-Hakam', english: 'The Judge', bengali: 'বিচারক', meaningEn: 'The One who He is the Ruler and His judgment is His Word.', meaningBn: 'যিনি শাসক এবং তাঁর বিচার তাঁর বাণী।' },
  { number: 29, arabic: 'الْعَدْلُ', transliteration: 'Al-Adl', english: 'The Just', bengali: 'ন্যায়পরায়ণ', meaningEn: 'The One who is entitled to do what He does.', meaningBn: 'যিনি যা করেন তা করার অধিকার রাখেন।' },
  { number: 30, arabic: 'اللَّطِيفُ', transliteration: 'Al-Latif', english: 'The Subtle One', bengali: 'সূক্ষ্মদর্শী', meaningEn: 'The One who is kind to His slaves and endows upon them.', meaningBn: 'যিনি তাঁর বান্দাদের প্রতি দয়ালু এবং তাদের দান করেন।' },
  { number: 31, arabic: 'الْخَبِيرُ', transliteration: 'Al-Khabir', english: 'The All-Aware', bengali: 'সর্ববিষয়ে অবহিত', meaningEn: 'The One who knows the truth of things.', meaningBn: 'যিনি বিষয়গুলির সত্য জানেন।' },
  { number: 32, arabic: 'الْحَلِيمُ', transliteration: 'Al-Halim', english: 'The Forbearing', bengali: 'ধৈর্যশীল', meaningEn: 'The One who delays the punishment for those who deserve it.', meaningBn: 'যিনি যারা শাস্তির যোগ্য তাদের শাস্তি বিলম্বিত করেন।' },
  { number: 33, arabic: 'الْعَظِيمُ', transliteration: 'Al-Azim', english: 'The Magnificent', bengali: 'মহিমান্বিত', meaningEn: 'The One who is clear from the attributes of the creatures.', meaningBn: 'যিনি সৃষ্টির বৈশিষ্ট্য থেকে মুক্ত।' },
  { number: 34, arabic: 'الْغَفُورُ', transliteration: 'Al-Ghafur', english: 'The Forgiving', bengali: 'ক্ষমাশীল', meaningEn: 'The One who forgives a lot.', meaningBn: 'যিনি অনেক ক্ষমা করেন।' },
  { number: 35, arabic: 'الشَّكُورُ', transliteration: 'Ash-Shakur', english: 'The Grateful', bengali: 'কৃতজ্ঞ', meaningEn: 'The One who gives plenty of reward for a small obedience.', meaningBn: 'যিনি সামান্য আনুগত্যের জন্য প্রচুর পুরস্কার দেন।' },
  { number: 36, arabic: 'الْعَلِيُّ', transliteration: 'Al-Ali', english: 'The Most High', bengali: 'সুউচ্চ', meaningEn: 'The One who is clear from the attributes of the creatures.', meaningBn: 'যিনি সৃষ্টির বৈশিষ্ট্য থেকে মুক্ত।' },
  { number: 37, arabic: 'الْكَبِيرُ', transliteration: 'Al-Kabir', english: 'The Most Great', bengali: 'মহান', meaningEn: 'The One who is greater than everything in status.', meaningBn: 'যিনি মর্যাদায় সবকিছুর চেয়ে বড়।' },
  { number: 38, arabic: 'الْحَفِيظُ', transliteration: 'Al-Hafiz', english: 'The Preserver', bengali: 'রক্ষণাবেক্ষণকারী', meaningEn: 'The One who protects whatever and whoever He willed to protect.', meaningBn: 'যিনি যা এবং যাকে রক্ষা করতে চান তা রক্ষা করেন।' },
  { number: 39, arabic: 'الْمُقِيتُ', transliteration: 'Al-Muqit', english: 'The Maintainer', bengali: 'রক্ষণাবেক্ষণকারী', meaningEn: 'The One who has the Power.', meaningBn: 'যাঁর ক্ষমতা আছে।' },
  { number: 40, arabic: 'الْحَسِيبُ', transliteration: 'Al-Hasib', english: 'The Reckoner', bengali: 'হিসাবগ্রহণকারী', meaningEn: 'The One who gives the satisfaction.', meaningBn: 'যিনি সন্তুষ্টি দান করেন।' },
  { number: 41, arabic: 'الْجَلِيلُ', transliteration: 'Al-Jalil', english: 'The Majestic', bengali: 'মহিমাময়', meaningEn: 'The One who is attributed with greatness of Power.', meaningBn: 'যিনি ক্ষমতার মহত্ত্বে বিশিষ্ট।' },
  { number: 42, arabic: 'الْكَرِيمُ', transliteration: 'Al-Karim', english: 'The Generous', bengali: 'মহানুভব', meaningEn: 'The One who is clear from abjectness.', meaningBn: 'যিনি নীচতা থেকে মুক্ত।' },
  { number: 43, arabic: 'الرَّقِيبُ', transliteration: 'Ar-Raqib', english: 'The Watchful', bengali: 'সতর্ক পর্যবেক্ষক', meaningEn: 'The One that nothing is absent from Him.', meaningBn: 'যাঁর কাছ থেকে কিছুই অনুপস্থিত নয়।' },
  { number: 44, arabic: 'الْمُجِيبُ', transliteration: 'Al-Mujib', english: 'The Responsive', bengali: 'প্রার্থনা কবুলকারী', meaningEn: 'The One who answers the one in need if he asks Him.', meaningBn: 'যিনি প্রয়োজনে থাকা ব্যক্তির প্রার্থনায় সাড়া দেন।' },
  { number: 45, arabic: 'الْوَاسِعُ', transliteration: 'Al-Wasi\'', english: 'The All-Encompassing', bengali: 'প্রশস্ত', meaningEn: 'The One who Suffices all the creatures.', meaningBn: 'যিনি সকল সৃষ্টির জন্য যথেষ্ট।' },
  { number: 46, arabic: 'الْحَكِيمُ', transliteration: 'Al-Hakim', english: 'The Wise', bengali: 'প্রজ্ঞাময়', meaningEn: 'The One who is correct in His doings.', meaningBn: 'যিনি তাঁর কাজে সঠিক।' },
  { number: 47, arabic: 'الْوَدُودُ', transliteration: 'Al-Wadud', english: 'The Loving', bengali: 'প্রেমময়', meaningEn: 'The One who loves His believing slaves.', meaningBn: 'যিনি তাঁর বিশ্বাসী বান্দাদের ভালোবাসেন।' },
  { number: 48, arabic: 'الْمَجِيدُ', transliteration: 'Al-Majid', english: 'The Glorious', bengali: 'মহিমান্বিত', meaningEn: 'The One who is with perfect Power, High Status, Compassion.', meaningBn: 'যিনি পূর্ণ ক্ষমতা, উচ্চ মর্যাদা, করুণার অধিকারী।' },
  { number: 49, arabic: 'الْبَاعِثُ', transliteration: 'Al-Ba\'ith', english: 'The Resurrector', bengali: 'পুনরুত্থানকারী', meaningEn: 'The One who resurrects His slaves after death.', meaningBn: 'যিনি মৃত্যুর পর বান্দাদের পুনরুত্থিত করেন।' },
  { number: 50, arabic: 'الشَّهِيدُ', transliteration: 'Ash-Shahid', english: 'The Witness', bengali: 'সাক্ষী', meaningEn: 'The One who nothing is absent from Him.', meaningBn: 'যাঁর কাছ থেকে কিছুই অনুপস্থিত নয়।' },
  { number: 51, arabic: 'الْحَقُّ', transliteration: 'Al-Haqq', english: 'The Truth', bengali: 'সত্য', meaningEn: 'The One who truly exists.', meaningBn: 'যিনি সত্যই বিদ্যমান।' },
  { number: 52, arabic: 'الْوَكِيلُ', transliteration: 'Al-Wakil', english: 'The Trustee', bengali: 'কার্যসম্পাদক', meaningEn: 'The One who gives the satisfaction and is relied upon.', meaningBn: 'যিনি সন্তুষ্টি দেন এবং যাঁর উপর নির্ভর করা হয়।' },
  { number: 53, arabic: 'الْقَوِيُّ', transliteration: 'Al-Qawiyy', english: 'The Strong', bengali: 'শক্তিশালী', meaningEn: 'The One with the complete Power.', meaningBn: 'সম্পূর্ণ ক্ষমতার অধিকারী।' },
  { number: 54, arabic: 'الْمَتِينُ', transliteration: 'Al-Matin', english: 'The Firm', bengali: 'সুদৃঢ়', meaningEn: 'The One with extreme Power which is un-interrupted.', meaningBn: 'অবিরত চরম ক্ষমতার অধিকারী।' },
  { number: 55, arabic: 'الْوَلِيُّ', transliteration: 'Al-Waliyy', english: 'The Protecting Friend', bengali: 'অভিভাবক', meaningEn: 'The One who supports the believers.', meaningBn: 'যিনি বিশ্বাসীদের সমর্থন করেন।' },
  { number: 56, arabic: 'الْحَمِيدُ', transliteration: 'Al-Hamid', english: 'The Praiseworthy', bengali: 'প্রশংসনীয়', meaningEn: 'The praised One who deserves to be praised.', meaningBn: 'প্রশংসিত যিনি প্রশংসার যোগ্য।' },
  { number: 57, arabic: 'الْمُحْصِي', transliteration: 'Al-Muhsi', english: 'The Counter', bengali: 'গণনাকারী', meaningEn: 'The One who the count of things are known to Him.', meaningBn: 'যাঁর কাছে সবকিছুর গণনা জানা আছে।' },
  { number: 58, arabic: 'الْمُبْدِئُ', transliteration: 'Al-Mubdi\'', english: 'The Originator', bengali: 'সৃষ্টির সূচনাকারী', meaningEn: 'The One who started the human being.', meaningBn: 'যিনি মানুষের সূচনা করেছেন।' },
  { number: 59, arabic: 'الْمُعِيدُ', transliteration: 'Al-Mu\'id', english: 'The Restorer', bengali: 'পুনঃসৃষ্টিকারী', meaningEn: 'The One who brings back the creatures after death.', meaningBn: 'যিনি মৃত্যুর পর সৃষ্টিকে ফিরিয়ে আনেন।' },
  { number: 60, arabic: 'الْمُحْيِي', transliteration: 'Al-Muhyi', english: 'The Giver of Life', bengali: 'জীবনদাতা', meaningEn: 'The One who took out a living human from semen.', meaningBn: 'যিনি বীর্য থেকে জীবন্ত মানুষ সৃষ্টি করেন।' },
  { number: 61, arabic: 'الْمُمِيتُ', transliteration: 'Al-Mumit', english: 'The Bringer of Death', bengali: 'মৃত্যুদাতা', meaningEn: 'The One who renders the living dead.', meaningBn: 'যিনি জীবিতদের মৃত করেন।' },
  { number: 62, arabic: 'الْحَيُّ', transliteration: 'Al-Hayy', english: 'The Ever-Living', bengali: 'চিরঞ্জীব', meaningEn: 'The One attributed with a life that is unlike our life.', meaningBn: 'এমন জীবনের অধিকারী যা আমাদের জীবনের মতো নয়।' },
  { number: 63, arabic: 'الْقَيُّومُ', transliteration: 'Al-Qayyum', english: 'The Self-Subsisting', bengali: 'স্বয়ংসম্পূর্ণ', meaningEn: 'The One who remains and does not end.', meaningBn: 'যিনি থাকেন এবং শেষ হন না।' },
  { number: 64, arabic: 'الْوَاجِدُ', transliteration: 'Al-Wajid', english: 'The Finder', bengali: 'প্রাপ্তকারী', meaningEn: 'The Rich who is never poor.', meaningBn: 'ধনী যিনি কখনও দরিদ্র নন।' },
  { number: 65, arabic: 'الْمَاجِدُ', transliteration: 'Al-Majid', english: 'The Noble', bengali: 'মহান', meaningEn: 'The One who is Majid.', meaningBn: 'যিনি মাজিদ।' },
  { number: 66, arabic: 'الْوَاحِدُ', transliteration: 'Al-Wahid', english: 'The One', bengali: 'একক', meaningEn: 'The One without a partner.', meaningBn: 'শরীকবিহীন এক।' },
  { number: 67, arabic: 'الْأَحَدُ', transliteration: 'Al-Ahad', english: 'The Unique', bengali: 'অদ্বিতীয়', meaningEn: 'The One without a partner.', meaningBn: 'শরীকবিহীন এক।' },
  { number: 68, arabic: 'الصَّمَدُ', transliteration: 'As-Samad', english: 'The Eternal', bengali: 'অমুখাপেক্ষী', meaningEn: 'The Master who is relied upon in matters.', meaningBn: 'প্রভু যাঁর উপর বিষয়ে নির্ভর করা হয়।' },
  { number: 69, arabic: 'الْقَادِرُ', transliteration: 'Al-Qadir', english: 'The Able', bengali: 'সক্ষম', meaningEn: 'The One attributed with Power.', meaningBn: 'ক্ষমতার অধিকারী।' },
  { number: 70, arabic: 'الْمُقْتَدِرُ', transliteration: 'Al-Muqtadir', english: 'The Powerful', bengali: 'শক্তিমান', meaningEn: 'The One with the perfect Power that nothing is withheld from Him.', meaningBn: 'সম্পূর্ণ ক্ষমতার অধিকারী যাঁর থেকে কিছুই আটকে রাখা হয় না।' },
  { number: 71, arabic: 'الْمُقَدِّمُ', transliteration: 'Al-Muqaddim', english: 'The Expediter', bengali: 'অগ্রসরকারী', meaningEn: 'The One who puts things in their right places.', meaningBn: 'যিনি জিনিসগুলিকে তাদের সঠিক স্থানে রাখেন।' },
  { number: 72, arabic: 'الْمُؤَخِّرُ', transliteration: 'Al-Mu\'akhkhir', english: 'The Delayer', bengali: 'বিলম্বকারী', meaningEn: 'The One who delays things.', meaningBn: 'যিনি জিনিস বিলম্বিত করেন।' },
  { number: 73, arabic: 'الْأَوَّلُ', transliteration: 'Al-Awwal', english: 'The First', bengali: 'প্রথম', meaningEn: 'The One whose Existence is without a beginning.', meaningBn: 'যাঁর অস্তিত্বের কোনো শুরু নেই।' },
  { number: 74, arabic: 'الْآخِرُ', transliteration: 'Al-Akhir', english: 'The Last', bengali: 'শেষ', meaningEn: 'The One whose Existence is without an end.', meaningBn: 'যাঁর অস্তিত্বের কোনো শেষ নেই।' },
  { number: 75, arabic: 'الظَّاهِرُ', transliteration: 'Az-Zahir', english: 'The Manifest', bengali: 'প্রকাশ্য', meaningEn: 'The One that nothing is above Him.', meaningBn: 'যাঁর উপরে কিছুই নেই।' },
  { number: 76, arabic: 'الْبَاطِنُ', transliteration: 'Al-Batin', english: 'The Hidden', bengali: 'গোপন', meaningEn: 'The One that nothing is underneath Him.', meaningBn: 'যাঁর নিচে কিছুই নেই।' },
  { number: 77, arabic: 'الْوَالِي', transliteration: 'Al-Wali', english: 'The Governor', bengali: 'শাসক', meaningEn: 'The One who owns things and manages them.', meaningBn: 'যিনি জিনিসের মালিক এবং সেগুলি পরিচালনা করেন।' },
  { number: 78, arabic: 'الْمُتَعَالِي', transliteration: 'Al-Muta\'ali', english: 'The Most Exalted', bengali: 'সর্বোচ্চ', meaningEn: 'The One who is clear from the attributes of the creation.', meaningBn: 'যিনি সৃষ্টির বৈশিষ্ট্য থেকে মুক্ত।' },
  { number: 79, arabic: 'الْبَرُّ', transliteration: 'Al-Barr', english: 'The Source of Goodness', bengali: 'পুণ্যময়', meaningEn: 'The One who is kind to His creatures.', meaningBn: 'যিনি তাঁর সৃষ্টির প্রতি দয়ালু।' },
  { number: 80, arabic: 'التَّوَّابُ', transliteration: 'At-Tawwab', english: 'The Acceptor of Repentance', bengali: 'তওবা কবুলকারী', meaningEn: 'The One who grants repentance to whoever He willed.', meaningBn: 'যিনি যাকে চান তওবা মঞ্জুর করেন।' },
  { number: 81, arabic: 'الْمُنْتَقِمُ', transliteration: 'Al-Muntaqim', english: 'The Avenger', bengali: 'প্রতিশোধগ্রহণকারী', meaningEn: 'The One who victoriously prevails over His enemies.', meaningBn: 'যিনি তাঁর শত্রুদের উপর বিজয়ীভাবে প্রাধান্য পান।' },
  { number: 82, arabic: 'الْعَفُوُّ', transliteration: 'Al-Afuw', english: 'The Pardoner', bengali: 'ক্ষমাকারী', meaningEn: 'The One with wide forgiveness.', meaningBn: 'বিস্তৃত ক্ষমার অধিকারী।' },
  { number: 83, arabic: 'الرَّؤُوفُ', transliteration: 'Ar-Ra\'uf', english: 'The Compassionate', bengali: 'অত্যন্ত স্নেহশীল', meaningEn: 'The One with extreme Mercy.', meaningBn: 'চরম দয়ার অধিকারী।' },
  { number: 84, arabic: 'مَالِكُ الْمُلْكِ', transliteration: 'Malik-ul-Mulk', english: 'The Owner of Sovereignty', bengali: 'রাজত্বের মালিক', meaningEn: 'The One who controls the Dominion.', meaningBn: 'যিনি রাজত্ব নিয়ন্ত্রণ করেন।' },
  { number: 85, arabic: 'ذُو الْجَلَالِ وَالْإِكْرَامِ', transliteration: 'Dhul-Jalali wal-Ikram', english: 'The Lord of Majesty and Generosity', bengali: 'মহিমা ও সম্মানের অধিকারী', meaningEn: 'The One who deserves to be Exalted and not denied.', meaningBn: 'যিনি উচ্চতার যোগ্য এবং অস্বীকৃত হওয়ার নন।' },
  { number: 86, arabic: 'الْمُقْسِطُ', transliteration: 'Al-Muqsit', english: 'The Equitable', bengali: 'ন্যায়বিচারক', meaningEn: 'The One who is Just in His judgment.', meaningBn: 'যিনি তাঁর বিচারে ন্যায়পরায়ণ।' },
  { number: 87, arabic: 'الْجَامِعُ', transliteration: 'Al-Jami\'', english: 'The Gatherer', bengali: 'একত্রকারী', meaningEn: 'The One who gathers the creatures on the Day of Judgment.', meaningBn: 'যিনি বিচার দিবসে সৃষ্টিকে একত্রিত করেন।' },
  { number: 88, arabic: 'الْغَنِيُّ', transliteration: 'Al-Ghani', english: 'The Self-Sufficient', bengali: 'অমুখাপেক্ষী', meaningEn: 'The One who does not need the creation.', meaningBn: 'যাঁর সৃষ্টির প্রয়োজন নেই।' },
  { number: 89, arabic: 'الْمُغْنِي', transliteration: 'Al-Mughni', english: 'The Enricher', bengali: 'সমৃদ্ধিদাতা', meaningEn: 'The One who satisfies the necessities of the creatures.', meaningBn: 'যিনি সৃষ্টির প্রয়োজন পূরণ করেন।' },
  { number: 90, arabic: 'الْمَانِعُ', transliteration: 'Al-Mani\'', english: 'The Preventer', bengali: 'নিবারণকারী', meaningEn: 'The One who prevents whoever He willed.', meaningBn: 'যিনি যাকে চান বাধা দেন।' },
  { number: 91, arabic: 'الضَّارُّ', transliteration: 'Ad-Darr', english: 'The Distresser', bengali: 'কষ্টদাতা', meaningEn: 'The One who makes harm reach to whoever He willed.', meaningBn: 'যিনি যাকে চান তার কাছে কষ্ট পৌঁছান।' },
  { number: 92, arabic: 'النَّافِعُ', transliteration: 'An-Nafi\'', english: 'The Benefactor', bengali: 'উপকারকারী', meaningEn: 'The One who gives benefits to whoever He wills.', meaningBn: 'যিনি যাকে চান উপকার দেন।' },
  { number: 93, arabic: 'النُّورُ', transliteration: 'An-Nur', english: 'The Light', bengali: 'আলো', meaningEn: 'The One who guides.', meaningBn: 'যিনি পথ দেখান।' },
  { number: 94, arabic: 'الْهَادِي', transliteration: 'Al-Hadi', english: 'The Guide', bengali: 'পথপ্রদর্শক', meaningEn: 'The One whom with His Guidance His believers were guided.', meaningBn: 'যাঁর পথনির্দেশনায় বিশ্বাসীরা সুপথ পায়।' },
  { number: 95, arabic: 'الْبَدِيعُ', transliteration: 'Al-Badi\'', english: 'The Incomparable', bengali: 'অতুলনীয়', meaningEn: 'The One who created the creation and formed it without any preceding example.', meaningBn: 'যিনি কোনো পূর্ববর্তী উদাহরণ ছাড়াই সৃষ্টি করেছেন।' },
  { number: 96, arabic: 'الْبَاقِي', transliteration: 'Al-Baqi', english: 'The Everlasting', bengali: 'চিরস্থায়ী', meaningEn: 'The One that the state of non-existence is impossible for Him.', meaningBn: 'যাঁর জন্য অস্তিত্বহীনতা অসম্ভব।' },
  { number: 97, arabic: 'الْوَارِثُ', transliteration: 'Al-Warith', english: 'The Inheritor', bengali: 'উত্তরাধিকারী', meaningEn: 'The One whose Existence remains.', meaningBn: 'যাঁর অস্তিত্ব থাকে।' },
  { number: 98, arabic: 'الرَّشِيدُ', transliteration: 'Ar-Rashid', english: 'The Guide to the Right Path', bengali: 'সঠিক পথের দিশারী', meaningEn: 'The One who guides to the right path.', meaningBn: 'যিনি সঠিক পথ দেখান।' },
  { number: 99, arabic: 'الصَّبُورُ', transliteration: 'As-Sabur', english: 'The Patient', bengali: 'ধৈর্যশীল', meaningEn: 'The One who does not quickly punish the sinners.', meaningBn: 'যিনি পাপীদের দ্রুত শাস্তি দেন না।' },
];

const NamesOfAllah: React.FC = () => {
  const { t, isEnglish } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopy = (name: Name) => {
    const text = `${name.arabic}\n${name.transliteration}\n${isEnglish ? name.english : name.bengali}\n\n${isEnglish ? name.meaningEn : name.meaningBn}`;
    navigator.clipboard.writeText(text);
    toast({
      title: isEnglish ? 'Copied!' : 'কপি হয়েছে!',
      description: isEnglish ? 'Name copied to clipboard' : 'নাম ক্লিপবোর্ডে কপি হয়েছে',
    });
  };

  const filteredNames = namesOfAllah.filter((name) => {
    const query = searchQuery.toLowerCase();
    return (
      name.transliteration.toLowerCase().includes(query) ||
      name.english.toLowerCase().includes(query) ||
      name.bengali.includes(query) ||
      name.number.toString().includes(query)
    );
  });

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-amber-500/10 mb-4">
            <Star className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-1">
            {t('names.title')}
          </h1>
          <p className="arabic-text text-2xl text-primary mb-2">
            {t('names.subtitle')}
          </p>
          <p className="text-muted-foreground">
            {isEnglish ? 'The Beautiful Names of Allah' : 'আল্লাহর সুন্দর নামসমূহ'}
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={isEnglish ? 'Search names...' : 'নাম খুঁজুন...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Names Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNames.map((name) => (
            <Card key={name.number} className="overflow-hidden group hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {name.number}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleCopy(name)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <p className="arabic-text text-3xl text-center text-primary mb-2">
                  {name.arabic}
                </p>

                <p className="text-center font-medium text-foreground mb-1">
                  {name.transliteration}
                </p>

                <p className="text-center text-sm text-muted-foreground mb-3">
                  {isEnglish ? name.english : name.bengali}
                </p>

                <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">
                  {isEnglish ? name.meaningEn : name.meaningBn}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default NamesOfAllah;
