import type { Locale } from "@/lib/types";

export interface FaqItem {
  question: string;
  answer: string;
}

export function getHomeFaqs(locale: Locale): FaqItem[] {
  switch (locale) {
    case "ar":
      return [
        {
          question: "كيف أجد صيدلية حراسة مفتوحة قريبة مني الآن؟",
          answer:
            "اختر مدينتك من القائمة أعلاه (مثل الدار البيضاء، الرباط، مراكش، طنجة، فاس، أكادير)، وستظهر لك فوراً صيدليات الحراسة المفتوحة اليوم مع العناوين الدقيقة، أرقام الهواتف المباشرة، ومسارات GPS عبر Google Maps وWaze.",
        },
        {
          question: "كيف يعمل نظام الحراسة للصيدليات في المغرب؟",
          answer:
            "تخضع الصيدليات في المغرب لجدول دوري معتمد من نقابات الصيادلة. تشمل الخدمة حراسة نهارية (أيام الآحاد والعطل من 08:30 إلى 20:00)، حراسة ليلية تبدأ من 20:00 حتى صباح اليوم التالي، وصيدليات تقدم خدمة مستمرة 24/24 ساعة.",
        },
        {
          question: "هل توجد زيادة قانونية في أسعار الأدوية أثناء الحراسة الليلية؟",
          answer:
            "نعم، تحدد القوانين والأنظمة الصيدلانية بالمغرب تعرفة رسمية لحراسة الليل تضاف للوصفات الطبية لتعويض دوام الصيدلي وفريقه ليلاً خارج أوقات العمل الاعتيادية.",
        },
        {
          question: "ما هي أرقام الطوارئ الصحية التي يمكن الاتصال بها في المغرب؟",
          answer:
            "في الحالات الطارئة، يمكنكم الاتصال بالإسعاف الطبي السريع (SAMU) على الرقم 141، والوقاية المدنية على 15، والشرطة على 19 (أو الدرك الملكي على 177 في المناطق القروية).",
        },
        {
          question: "هل معلومات الصيدليات وأرقام الهواتف محدثة يومياً؟",
          answer:
            "نعم، يتم تحديث بيانات صيدليات الحراسة على منصة H24 Pharmacie بانتظام يومياً من المصادر الرسمية لنقابات الصيادلة. وننصح دائماً بالاتصال المسبق بالصيدلية لتأكيد توفر الدواء.",
        },
      ];

    case "en":
      return [
        {
          question: "How can I find an open duty pharmacy near me right now?",
          answer:
            "Select your city from the list above (Casablanca, Rabat, Marrakech, Tangier, Fes, Agadir, etc.). H24 Pharmacie instantly displays open duty pharmacies with direct phone numbers, exact addresses, and GPS navigation via Google Maps and Waze.",
        },
        {
          question: "How do pharmacy duty shifts work in Morocco (Day, Night, 24/7)?",
          answer:
            "Duty rosters are established by regional pharmacy councils. Day shifts cover daytime, Sundays, and public holidays (typically 8:30 AM to 8:00 PM). Night shifts operate from 8:00 PM until the following morning. Several pharmacies also provide continuous 24/7 coverage.",
        },
        {
          question: "Is there a statutory night fee on medicines in Morocco?",
          answer:
            "Yes, Moroccan health regulations set an official night duty fee for prescriptions filled outside standard business hours to support on-call staff and 24/7 emergency service.",
        },
        {
          question: "What emergency phone numbers can I call in Morocco?",
          answer:
            "For medical emergencies, call the SAMU medical hotline at 141, Civil Protection (Fire & Ambulance) at 15, or the Police at 19 (177 for the Royal Gendarmerie in suburban/rural zones).",
        },
        {
          question: "Are pharmacy duty schedules and contact numbers verified daily?",
          answer:
            "Yes, our listings are refreshed daily using official pharmacy syndicate data. We recommend calling the pharmacy before traveling to ensure your required medication is in stock.",
        },
      ];

    case "es":
      return [
        {
          question: "¿Cómo puedo encontrar una farmacia de guardia abierta cerca de mí ahora mismo?",
          answer:
            "Seleccione su ciudad en la lista superior (Casablanca, Rabat, Marrakech, Tánger, Fez, Agadir...). H24 Pharmacie muestra al instante las farmacias de guardia abiertas con teléfono directo, dirección exacta y rutas GPS con Google Maps y Waze.",
        },
        {
          question: "¿Cómo funcionan los turnos de guardia farmacéutica en Marruecos (Día, Noche, 24h)?",
          answer:
            "Los turnos están regulados por los sindicatos farmacéuticos provinciales. La guardia diurna atiende domingos y festivos (normalmente 08:30 a 20:00), la guardia nocturna toma el relevo de 20:00 hasta la mañana siguiente, y diversas farmacias ofrecen servicio ininterrumpido 24 horas.",
        },
        {
          question: "¿Existe un suplemento oficial en los medicamentos durante la noche en Marruecos?",
          answer:
            "Sí, la normativa sanitaria marroquí contempla una tarifa legal de guardia nocturna aplicada a las recetas despachadas fuera del horario habitual para compensar el servicio de urgencia.",
        },
        {
          question: "¿Cuáles son los teléfonos de urgencia sanitaria en Marruecos?",
          answer:
            "Para urgencias médicas vitales, llame al SAMU al 141, a Protección Civil (ambulancias y bomberos) al 15, o a la Policía al 19 (177 para la Gendarmería Real en zonas rurales).",
        },
        {
          question: "¿Están verificadas y actualizadas las listas de farmacias de guardia?",
          answer:
            "Sí, la información se actualiza a diario con los datos oficiales de los colegios farmacéuticos. Aconsejamos llamar previamente a la farmacia para confirmar disponibilidad de medicamentos.",
        },
      ];

    case "fr":
    default:
      return [
        {
          question: "Comment trouver rapidement une pharmacie de garde ouverte près de moi ?",
          answer:
            "Sélectionnez votre ville ci-dessus (Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir...). H24 Pharmacie affiche immédiatement les officines de garde avec leur numéro de téléphone direct, leur adresse précise et un itinéraire GPS via Google Maps ou Waze.",
        },
        {
          question: "Comment fonctionnent les tours de garde au Maroc (jour, nuit, 24h/24) ?",
          answer:
            "Les permanences sont coordonnées par les syndicats des pharmaciens. La garde de jour couvre la journée, les dimanches et les jours fériés (généralement 08h30 à 20h00), la garde de nuit prend le relais de 20h00 jusqu'au lendemain matin, et certaines officines assurent un service continu 24h/24.",
        },
        {
          question: "Existe-t-il une majoration légale de nuit sur les médicaments ?",
          answer:
            "Oui, un honoraire forfaitaire légal de garde de nuit (fixé par la réglementation marocaine) s'applique aux ordonnances exécutées en dehors des heures habituelles d'ouverture pour compenser la permanence du pharmacien et de son équipe.",
        },
        {
          question: "Quels sont les numéros d'urgence médicale à composer au Maroc ?",
          answer:
            "En cas d'urgence vitale, composez le SAMU au 141, la Protection Civile (pompiers/ambulances) au 15, ou la Police au 19 (177 pour la Gendarmerie Royale en zone périurbaine ou rurale).",
        },
        {
          question: "Les listes de garde sont-elles vérifiées et fiables ?",
          answer:
            "Oui, nos listes sont actualisées quotidiennement à partir des relevés officiels des syndicats de pharmaciens. Nous recommandons toutefois d'appeler l'officine avant tout déplacement pour vérifier la disponibilité de vos médicaments.",
        },
      ];
  }
}

export function getCityFaqs(locale: Locale, cityName: string): FaqItem[] {
  switch (locale) {
    case "ar":
      return [
        {
          question: `كيف أعرف صيدلية الحراسة المفتوحة هذه الليلة في ${cityName}؟`,
          answer: `تحتوي القائمة أعلاه على جميع صيدليات الحراسة العاملة في ${cityName} الليلة. يمكنك تصفية النتائج حسب الفترة (ليل، نهار، أو 24 ساعة) واستخدام زر الاتصال المباشر ومسار GPS عبر Google Maps وWaze.`,
        },
        {
          question: `ما هي أوقات دوام صيدليات الحراسة في ${cityName}؟`,
          answer: `تبدأ حراسة النهار في ${cityName} عادة من 08:30 صباحاً إلى 20:00 مساءً، بينما تبدأ الحراسة الليلية من 20:00 مساءً حتى صباح اليوم التالي. كما توجد صيدليات تعمل بنظام 24/24.`,
        },
        {
          question: `هل يجب الاتصال بالصيدلية قبل التوجه إليها في ${cityName}؟`,
          answer: `نعم، ننصح دائماً بالاتصال المسبق عبر رقم الهاتف المبيّن للتأكد من توفر الدواء المطلوب وتفادي أي تنقل غير ضروري ليلاً.`,
        },
        {
          question: `ما هي أرقام الإسعاف والطوارئ في ${cityName}؟`,
          answer: `يمكنكم الاتصال بالإسعاف الطبي SAMU على الرقم 141، أو الوقاية المدنية على الرقم 15 للحالات المستعجلة في ${cityName}.`,
        },
      ];

    case "en":
      return [
        {
          question: `How do I find a duty pharmacy open tonight in ${cityName}?`,
          answer: `The listing above contains all pharmacies on duty in ${cityName} tonight. You can filter by shift (Night, Day, 24/7) and use one-tap calling and GPS directions via Google Maps and Waze.`,
        },
        {
          question: `What are the operating hours for duty pharmacies in ${cityName}?`,
          answer: `In ${cityName}, day duty generally operates from 8:30 AM to 8:00 PM, while night duty starts at 8:00 PM and runs through the following morning. Several pharmacies remain open 24/7.`,
        },
        {
          question: `Should I call the pharmacy before visiting in ${cityName}?`,
          answer: `Yes, we strongly recommend calling the direct phone number provided to verify the availability of your prescription medications before travelling.`,
        },
        {
          question: `What are the emergency contact numbers for ${cityName}?`,
          answer: `In case of urgent medical assistance in ${cityName}, call SAMU ambulance service at 141, Civil Protection at 15, or Police at 19.`,
        },
      ];

    case "es":
      return [
        {
          question: `¿Cómo encuentro una farmacia de guardia abierta esta noche en ${cityName}?`,
          answer: `La lista superior reúne todas las farmacias de turno en ${cityName} esta noche. Puede filtrar por horario (Noche, Día, 24h) y usar la llamada directa y rutas GPS con Google Maps y Waze.`,
        },
        {
          question: `¿Cuáles son los horarios de las farmacias de guardia en ${cityName}?`,
          answer: `En ${cityName}, el turno de día funciona de 08:30 a 20:00, y el turno de noche cubre desde las 20:00 hasta la mañana siguiente. Existen además farmacias abiertas las 24 horas de forma continua.`,
        },
        {
          question: `¿Es recomendable llamar a la farmacia antes de desplazarse en ${cityName}?`,
          answer: `Sí, recomendamos siempre llamar al teléfono directo de la farmacia para confirmar existencias de los medicamentos y recetas necesarias.`,
        },
        {
          question: `¿Cuáles son los teléfonos de emergencias en ${cityName}?`,
          answer: `Para emergencias médicas graves en ${cityName}, llame al SAMU al 141, a Protección Civil al 15 o a la Policía al 19.`,
        },
      ];

    case "fr":
    default:
      return [
        {
          question: `Comment trouver une pharmacie de garde ouverte cette nuit à ${cityName} ?`,
          answer: `Consultez la liste ci-dessus en activant le filtre « Nuit » ou « 24h/24 ». H24 Pharmacie affiche l'adresse exacte, le numéro de téléphone direct et l'itinéraire GPS (Google Maps / Waze) vers chaque officine de garde à ${cityName}.`,
        },
        {
          question: `Quels sont les horaires des pharmacies de garde à ${cityName} ?`,
          answer: `À ${cityName}, la garde de jour assure le service en journée (08h30 - 20h00), et la garde de nuit prend le relais de 20h00 jusqu'au lendemain matin. Certaines officines assurent une permanence continue 24h/24.`,
        },
        {
          question: `Faut-il appeler la pharmacie avant de se déplacer à ${cityName} ?`,
          answer: `Oui, nous recommandons systématiquement d'appeler la pharmacie au préalable pour confirmer la disponibilité des produits et ordonnances nécessaires.`,
        },
        {
          question: `Quels sont les numéros d'urgence médicale à ${cityName} ?`,
          answer: `En cas d'urgence médicale à ${cityName}, composez le SAMU au 141, la Protection Civile au 15, ou la Police au 19.`,
        },
      ];
  }
}

export function getZoneFaqs(
  locale: Locale,
  cityName: string,
  zoneName: string,
): FaqItem[] {
  switch (locale) {
    case "ar":
      return [
        {
          question: `كيف أعثر على صيدلية حراسة في حي ${zoneName} بـ ${cityName}؟`,
          answer: `القائمة أعلاه مخصصة لصيدليات الحراسة العاملة في ${zoneName} (${cityName}). إذا لم تكن هناك صيدلية مخصصة لهذا الحي في مناوبة اليوم، ستجد صيدليات الحراسة في الأحياء المجاورة الأقرب إليك.`,
        },
        {
          question: `هل يمكن الوصول بسرعة عبر نظام الملاحة GPS إلى صيدليات ${zoneName}؟`,
          answer: `نعم، انقر على زر خرائط Google أو Waze أمام أي صيدلية في ${zoneName} لبدء مسار التنقل الدقيق مباشرة من موقعك الحالي.`,
        },
        {
          question: `ماذا أفعل إذا كانت صيدلية ${zoneName} مغلقة أو ينقصها الدواء؟`,
          answer: `اتصل أولاً بالرقم المباشر للصيدلية، وفي حال عدم التوفر يمكنك مراجعة صيدليات الحراسة 24/24 في وسط ${cityName} أو الاتصال بالطوارئ (141 / 15).`,
        },
      ];

    case "en":
      return [
        {
          question: `How do I find an on-duty pharmacy in ${zoneName}, ${cityName}?`,
          answer: `The listing above highlights pharmacies on duty serving ${zoneName} in ${cityName}. If no specific pharmacy is scheduled in this exact neighborhood today, the nearest open duty pharmacies in adjacent districts are shown.`,
        },
        {
          question: `Can I get GPS navigation to pharmacies in ${zoneName}?`,
          answer: `Yes, simply tap the Google Maps or Waze button next to any pharmacy in ${zoneName} for instant turn-by-turn driving or walking directions.`,
        },
        {
          question: `What should I do if a pharmacy in ${zoneName} is out of stock?`,
          answer: `We advise calling ahead using the direct phone button. If a specific medicine is unavailable, consult the round-the-clock 24/7 pharmacies across ${cityName} or call SAMU at 141.`,
        },
      ];

    case "es":
      return [
        {
          question: `¿Cómo encontrar una farmacia de guardia en el barrio ${zoneName} de ${cityName}?`,
          answer: `La lista superior está filtrada para las farmacias de guardia en ${zoneName} (${cityName}). Si hoy no hay turno exclusivo en esta zona, se muestran las farmacias abiertas más próximas en los barrios contiguos.`,
        },
        {
          question: `¿Puedo abrir la ruta GPS hacia las farmacias de ${zoneName}?`,
          answer: `Sí, pulse el botón de Google Maps o Waze junto a cada farmacia de ${zoneName} para iniciar la navegación guiada en tiempo real desde su ubicación.`,
        },
        {
          question: `¿Qué hacer si la farmacia de ${zoneName} no dispone de mi medicamento?`,
          answer: `Recomendamos llamar por teléfono antes de desplazarse. En caso de rotura de stock, consulte las farmacias 24h abiertas en ${cityName} o llame al teléfono de urgencias 141.`,
        },
      ];

    case "fr":
    default:
      return [
        {
          question: `Comment trouver une pharmacie de garde dans le quartier ${zoneName} à ${cityName} ?`,
          answer: `La sélection ci-dessus présente les officines de garde desservant ${zoneName} à ${cityName}. Si aucune pharmacie n'est spécifiquement de tour dans ce secteur aujourd'hui, les officines ouvertes les plus proches dans les quartiers voisins sont affichées.`,
        },
        {
          question: `Comment obtenir l'itinéraire GPS vers une pharmacie à ${zoneName} ?`,
          answer: `Cliquez simplement sur l'icône Google Maps ou Waze associée à chaque officine de ${zoneName} pour lancer le guidage routier ou piéton depuis votre position.`,
        },
        {
          question: `Que faire si une pharmacie à ${zoneName} n'a pas le médicament recherché ?`,
          answer: `Appelez préalablement l'officine via son bouton téléphonique direct. En cas d'indisponibilité, orientez-vous vers les pharmacies de garde 24h/24 de ${cityName} ou contactez les urgences médicales (141 / 15).`,
        },
      ];
  }
}

export function getFaqSectionMeta(
  locale: Locale,
  entityName?: string,
): { title: string; subtitle: string } {
  switch (locale) {
    case "ar":
      return {
        title: entityName
          ? `الأسئلة الشائعة حول صيدليات الحراسة في ${entityName}`
          : "الأسئلة الشائعة حول صيدليات الحراسة بالمغرب",
        subtitle:
          "كل ما تحتاج لمعرفته حول مواعيد الحراسة، المناوبة الليلية، وأرقام الطوارئ الصحية.",
      };

    case "en":
      return {
        title: entityName
          ? `Frequently Asked Questions about Duty Pharmacies in ${entityName}`
          : "Frequently Asked Questions about Duty Pharmacies in Morocco",
        subtitle:
          "Everything you need to know about duty schedules, night shifts, emergency hotlines, and health regulations.",
      };

    case "es":
      return {
        title: entityName
          ? `Preguntas Frecuentes sobre Farmacias de Guardia en ${entityName}`
          : "Preguntas Frecuentes sobre Farmacias de Guardia en Marruecos",
        subtitle:
          "Todo lo que necesita saber sobre turnos, guardia nocturna, teléfonos de urgencia y normativa farmacéutica.",
      };

    case "fr":
    default:
      return {
        title: entityName
          ? `Questions fréquentes sur les pharmacies de garde à ${entityName}`
          : "Questions fréquentes sur les pharmacies de garde au Maroc",
        subtitle:
          "Tout ce que vous devez savoir sur le fonctionnement, les horaires, les urgences et les gardes de nuit.",
      };
  }
}
