// İSPARK'a Sor sayfasındaki soru-cevapların birebir kopyası.
// Kaynak: https://ispark.istanbul/isparka-sor/ (2026-11-01 tarihinde alındı)
// Asistan bu bilgileri ezberden okumaz; soruyu anlayıp bu bilgilerden çıkarım yaparak yanıt üretir.
// Bu listenin dışına çıkmaz. "anahtar" alanı yalnızca ilgili maddeyi bulmak içindir; modele gönderilmez.
// Sayfa güncellenirse burayı da güncelleyin.

export const SOURCE_URL = "https://ispark.istanbul/isparka-sor/";

const ONLINE_BASVURU = "https://ispark.istanbul/online-basvuru/";

export const FAQ = [
  {
    id: "sehit-yakini",
    anahtar: "şehit yakını anne baba eş dul yetim çocuk ücretsiz kart",
    kategori: "Özel statülü abonelik",
    soru: "Şehit yakını özel statülü abonelik başvurusu nasıl yapılır?",
    cevap:
      "İBB Emlak Müdürlüğü Güncel Tarifeleri'ne göre, Şehit yakınları, Aile ve Sosyal Hizmetler Bakanlığı tarafından verilen karta sahip şehitlerin dul eşleri, yetim aylığı alan çocukları ile anne ve babaları İSPARK A.Ş.'ye bildirim yapmaları ve adlarına kayıtlı bulunan hususi (yük nakli için ve ticari olmayan) bir (1) araç plakasını sisteme kaydettirmeleri koşuluyla yol üstü, katlı ve açık otoparklardan günlük ücretsiz yararlanırlar.\n" +
      `Kayıt işlemini, ilgili bakanlığın verdiği şehit yakını kartı ve araç ruhsat görüntüsünü ${ONLINE_BASVURU} adresinden sistemimize yükleyerek yapabilirler. Başvurularının onaylanması halinde kurumumuzdan ücretsiz hizmet alabilirler.`,
  },
  {
    id: "engelli",
    anahtar: "engelli özürlü ücretsiz 3 saat 10 saat ruhsat",
    kategori: "Özel statülü abonelik",
    soru: "Engelli özel statülü abonelik başvurusu nasıl yapılır?",
    cevap:
      "İBB Emlak Müdürlüğü Güncel Tarifeleri'ne göre, ruhsatında engelli ibaresi bulunan araç sahibi sürücüler, adlarına tescilli olan hususi bir (1) aracını, İSPARK A.Ş.'ye bildirimde bulunarak araç plakalarını sisteme kaydettirmeleri koşuluyla yol üstü otoparklarımızdan günde 3 saat, katlı ve açık otoparklarımızdan günde 10 saat ücretsiz yararlanabilirler. Ücretsiz kullanım süresinin aşılması durumunda süre aşımından kaynaklanan otopark ücretleri normal tarife üzerinden araç kullanıcısı ve/veya ruhsat sahibinden tahsil edilecektir.\n" +
      `Kayıt işlemini, araç ruhsatında engelli ibaresi olan müşterilerimiz adlarına tescilli olan araçlarının ruhsat görüntüsünü online başvuru adresinden (${ONLINE_BASVURU}) sistemimize yükleyerek yapabilirler. Başvurularının onaylanması halinde yol üstü otoparklarında günde 3 saat, açık ve katlı (Bariyerli) otoparklarımızda günde 10 saat ücretsiz yararlanabilirler.`,
  },
  {
    id: "gazi",
    anahtar: "gazi gazi eşi malul ücretsiz kart",
    kategori: "Özel statülü abonelik",
    soru: "Gazi ve yakını özel statülü abonelik başvurusu nasıl yapılır?",
    cevap:
      "İBB Emlak Müdürlüğü Güncel Tarifeleri'ne göre, Aile ve Sosyal Hizmetler Bakanlığı tarafından verilen karta sahip harp ve vazife malulü gaziler ve eşleri, İSPARK A.Ş.'ye bildirim yapmaları ve adlarına kayıtlı bulunan hususi (yük nakli için ve ticari olmayan) bir (1) araç plakasını sisteme kaydettirmeleri koşuluyla yol üstü, katlı ve açık otoparklardan günlük ücretsiz yararlanırlar.\n" +
      `Kayıt işlemini, Gazinin kendisi ve eşi, adlarına kayıtlı olan araçlarını ilgili bakanlığın verdiği Gazi / Gazi Eşi kartı ve araç ruhsat görüntüsünü ${ONLINE_BASVURU} adresinden sistemimize yükleyerek başvuru yapabilirler. Başvurularının onaylanması halinde kurumumuzdan ücretsiz hizmet alabilirler.`,
  },
  {
    id: "ozel-statu-plaka-iptal",
    anahtar: "özel statü kayıt silme vefat iptal plaka değişikliği",
    kategori: "Özel statülü abonelik",
    soru: "Özel statülü aboneler (Engelli, Gazi ve Yakını, Şehit Yakını) plaka değişikliği veya iptal işlemi nasıl yapabilir?",
    cevap:
      "İBB Emlak Müdürlüğü Güncel Tarifeleri'ne göre, Özel statülü abonelerimiz (Engelli, Gazi ve Yakını, Şehit Yakını) herhangi bir sebeple plaka kaydının silinmesini istediği takdirde kendileri, vefat durumunda ise yakınları, abonehizmetleri@ispark.istanbul mail adresi veya ALO 153 iletişim hattından bildirimde bulunabilirler.\n" +
      `Yeni araç alımı ya da plaka değişikliğinde yeniden online başvuru (${ONLINE_BASVURU}) yapılması gerekmektedir.`,
  },
  {
    id: "borc-odeme",
    anahtar: "borç borcum borcumu öde öderim ödeme yap ödenir sorgulama",
    kategori: "Borç ve ödeme",
    soru: "Borç sorgulama sırasında plakada görülen park borcu nasıl ödenir?",
    cevap: "Sorgulama ekranında online olarak veya herhangi bir İSPARK noktasında ödeme yapabilirsiniz.",
  },
  {
    id: "borc-itiraz",
    anahtar: "itiraz başkasının başkası eski sahibi önceki sahip benim değil bana ait değil yanlış borç ikinci el sıfır araç tescil",
    kategori: "Borç ve ödeme",
    soru: "Plakamda bana ait olmayan park borcu görünmektedir. Nereye itiraz edebilirim?",
    cevap:
      `Park borcunun size ait olmadığını ve son tescil tarihinden önceki plaka sahibine ait olduğunu düşünüyorsanız, sıfır araçlar için online başvuru yoluyla ruhsat görüntüsü (TC kimlik, Ad Soyad ve Plaka hanesinin yer aldığı sayfa görünecek şekilde); ikinci el araçlar için ise online başvuru yolu ile ruhsat görüntüsü ve noter satış sözleşmesini resmi internet sitemizdeki online başvuru linkinden (${ONLINE_BASVURU}) “Tescil Öncesi Borç İtirazı” seçeneği ile online başvuru formunu doldurarak işlemlerini yapabilirler. İşleminizin sonuçlanma süreci 7 gündür.`,
  },
  {
    id: "parklanma-detay",
    anahtar: "park geçmişi giriş çıkış saatleri dökümü detay kayıtları şirket aracı",
    kategori: "Borç ve ödeme",
    soru: "Parklanma detaylarına nasıl ulaşabilirim?",
    cevap:
      "Başvurunuzu İSPARK AŞ Genel Müdürlüğüne şahsen yapmanız durumunda (ruhsat sahibi ya da yasal vekili tarafından) değerlendirilecek ve uygun görülmesi durumunda geçmiş dönem borç bilgileri ve parklanma detayları başvuru sahibi ile bildirdiği mail adresi üzerinden paylaşılacaktır.\n" +
      "Ruhsat sahibinin şahsen başvurusu esnasında kimlik, ruhsat ve vekilse noter onaylı yasal vekalet evrakının fotokopilerinin yanınızda olması gerekmektedir. Ruhsat sahibi dışında yapılan başvurulara KVKK hükümleri gereğince cevap verilememektedir.\n" +
      "Aracınız şirket üzerine kayıtlı ise, 6698 sayılı KVKK hükümleri ve kurum politikamız gereği, şirket adına tescilli araçlara ait park detayları, sadece şirket yetkilisinin İSPARK AŞ'ye şahsen başvurması durumunda paylaşılabilmektedir. Bu başvurularda; şirket imza sirkülerini, talep edilen bilgiyi almaya yetkili olduğunuza dair şirket vekâletinizi ya da yetki belgenizi, şirket kaşenizi, araç ruhsatını ve kimliğinizi ibraz etmeniz gerekmektedir.\n" +
      "Adres: Yamanevler Mahallesi Karacabey Sokak No:4 Ümraniye / İSTANBUL",
  },
  {
    id: "fis",
    anahtar: "fiş fatura makbuz vermedi",
    kategori: "Borç ve ödeme",
    soru: "Ödeme yaptım fiş alamadım, ne yapmalıyım?",
    cevap: "Otopark ücretini ödediğiniz halde fiş veya fatura alamadıysanız durumu İBB Çözüm Merkezi ALO 153’e iletebilirsiniz.",
  },
  {
    id: "ikinci-sira",
    anahtar: "çift sıra ikinci sıra sıraya sırada park etmiş etmişler yolu kapattı şikayet",
    kategori: "Şikâyet ve bildirim",
    soru: "İSPARK yol üstü otoparklarında 2. sıra parklanma yapılıyor. Nereye şikâyet edebilirim?",
    cevap:
      "İSPARK yol üstü otoparklarında personelimiz tarafından 2. sıra araç parkı yapılmamaktadır. Sürücüler tarafından yapılan 2. sıra araç parkına müdahale yetkimiz bulunmadığından Emniyet birimlerine bilgi vermenizi rica ederiz.",
  },
  {
    id: "degnekci",
    anahtar: "değnekçi değnekci korsan otoparkçı para istedi kayıt dışı",
    kategori: "Şikâyet ve bildirim",
    soru: "İSPARK otoparkında niteliksiz işletmeci (değnekçi) var. Ne yapmalıyım?",
    cevap:
      "İSPARK’ın uhdesinde bulunan yol üstü otoparklarının çalışma saatleri farklılık göstermektedir. Çalışma saatleri otopark tabelasında belirtilmiştir. Çalışma saatleri dışında gördüğünüz veya tespit ettiğiniz niteliksiz işletmecileri Emniyet birimlerine bildirmenizi rica ederiz.",
  },
  {
    id: "abone-olabilir-miyim",
    anahtar: "abone abonelik aylık olabilir miyim",
    kategori: "Abonelik",
    soru: "İSPARK otoparklarına abone olabilir miyim?",
    cevap:
      "Abonelik uygulaması her otoparkımızda bulunmamakta, İSPARK tarafından belirlenen otoparklarda abonelik uygulaması bulunmaktadır. Abonelik uygulaması olan otoparklarda istenilen abonelik başvuru işlemlerini https://ispark.istanbul/abone/ sayfasından yapabilirsiniz.",
  },
  {
    id: "abone-olmak",
    anahtar: "abone abonelik aylık başvuru nasıl olurum",
    kategori: "Abonelik",
    soru: "Abone olmak için ne yapmalıyım?",
    cevap:
      "Abonelik uygulaması her otoparkımızda bulunmamakta, İSPARK tarafından belirlenen otoparklarda abonelik uygulaması bulunmaktadır. Abonelik uygulaması olan otoparklarda istenilen abonelik başvuru işlemlerini https://ispark.istanbul/abone/ sayfasından yapabilirsiniz.",
  },
  {
    id: "hasar",
    anahtar: "hasar çizik çizildi çarptı çarpılmış kaza vurdu göçük göçmüş kırıldı zarar tazminat",
    kategori: "Şikâyet ve bildirim",
    soru: "İSPARK otoparkında aracım hasar gördü. Ne yapmalıyım?",
    cevap:
      "İSPARK otoparklarında oluşan araç hasarı için, otoparkta hasar başvuru dilekçesini doldurarak otopark görevlisine iletebilir veya ilgili evraklar ile hasar@ispark.istanbul adresine mail olarak da gönderebilirsiniz. Başvurunuz İSPARK Zarar Takdir Komisyonu tarafından incelenerek karar verilmektedir. 0216 635 00 99 dahili 3 iletişim numarasından detaylı bilgi alabilirsiniz.",
  },
  {
    id: "sabiha-gokcen",
    anahtar: "havalimanı havaalanı sabiha gökçen servis uçak",
    kategori: "Otoparklar",
    soru: "İSPARK Sabiha Gökçen P+R Otoparkı ile ilgili detaylı bilgi nasıl alınır?",
    cevap:
      "İSPARK Sabiha Gökçen P+R Havalimanı Otoparkı’nda 1075 araç kapasite ile 24 saat, günlük 30 tarifeyle hizmet veriyoruz. Hafta içi 15 dakika, hafta sonu 10 dakika aralıklarla sefer yapan ücretsiz servis bulunmaktadır.\n" +
      "Detaylı bilgi: https://ispark.istanbul/haberler/ispark-sabiha-gokcen-havalimani-otoparki/",
  },
  {
    id: "belge-yukleme",
    anahtar: "belge yükleme yükleyemiyorum dosya kiralama sözleşmesi muvafakatname pdf",
    kategori: "Abonelik",
    soru: "Online Abone Başvuru sistemine Araç Ruhsatı ve TC kimlik kartı görseli dışında belge yükleyemiyorum. Diğer belgelerimi nasıl yükleyebilirim?",
    cevap:
      "Telefona veya bilgisayara kaydedilen belgeler “Dosya seç” tıklanarak yüklenir. “Dosya seç” tıklanarak ruhsat ve istenilen diğer belgelerin fotoğrafı çekilerek yüklenir. Plaka Aboneliği başvurusunda ikiden fazla belge (Kiralama sözleşmesi, Muvafakatname, imza sirküsü, vergi levhası vb.) yüklemeniz gerektiğinde belgeler taranarak ya da okunur şekilde fotoğrafı çekilerek jpg / jpeg / png / pdf gibi formatlarda tek dosya halinde yükleme yapılabilir. Ruhsat, plaka ve isim hanesinin bulunduğu sayfalar görünecek şekilde tam nüsha olarak yüklenmelidir. Eğer eski tip ruhsata sahipseniz ve ön ve arka yüzü tek karede çekilemiyorsa yan yana olacak şekilde yüklenebilir.",
  },
  {
    id: "engelli-plaka-degisim",
    anahtar: "engelli plaka değişimi yeni araç vefat satış",
    kategori: "Özel statülü abonelik",
    soru: "Engelli aracım için plaka değişim talebinde bulunmak istiyorum, ne yapabilirim?",
    cevap:
      "Ruhsatında “Engelli” ibaresi bulunan abonelerde vefat, satış, veraset gibi çeşitli nedenlerle araç plakasının değişmesi halinde, öncelikli olarak aboneler@ispark.istanbul adresine bilgi verilerek “İstanbul Geneli Kayıt” durumu ile birlikte aylık abonelik kaydının sonlandırılması sağlanmalıdır.\n" +
      `Akabinde yeni plaka ile önce ${ONLINE_BASVURU} adresinden online başvuru yapılarak yeni plakanın İstanbul Geneli Kaydı sağlanır; kayıt onayı alındıktan sonra ise https://ispark.istanbul/abone/ adresinden aylık abonelik için başvuru yapılarak yeni araç için Plaka Aboneliği talebi oluşturulur. Yeni plaka ile yapılan başvurunun onaylanması halinde ilgili otoparkta abonelik başlatılmış olur.`,
  },
  {
    id: "kontenjan",
    anahtar: "kontenjan yer yok reddedildi sıra boş",
    kategori: "Abonelik",
    soru: "Abonelik başvurum kontenjan yetersizliğinden dolayı sürekli reddediliyor, oysa otopark boş görünüyor, talebimi sıraya alabilir misiniz?",
    cevap:
      "Otoparkların günlük kullanımında yer bulma sorunu olmasa da Aylık Aboneler için kontenjan yetersizliği yaşanabilmektedir. Bu gibi durumlarda kontenjan yetersizliğinden dolayı abonelik talepleri reddedilir. Kontenjan uygunluğu dinamik olduğundan her ayın ilk 15 günü içerisinde başvurunuzu yenilemeniz uygun kontenjan bulabilmeniz açısından faydalı olacaktır. Kapasite yönetim politikamız gereği otoparkta yer ayırma ya da talepleri sıraya alma uygulaması bulunmamaktadır.",
  },
  {
    id: "iptal-iade",
    anahtar: "iptal iade geri ödeme cayma 14 gün paramı geri",
    kategori: "Abonelik",
    soru: "Aboneliğimi iptal etmek istiyorum ve ödediğim abonelik ücretimin iadesini istiyorum?",
    cevap:
      "Abonelerimizin ay sonunu beklemeden abonelik iptalinde bulunmak istemeleri halinde, başvuru esnasında beyan ettikleri e-mail hesaplarından aboneler@ispark.istanbul adresine e-mail ile iptal talebinde bulunmaları gerekir. 6502 sayılı Tüketicinin Korunması Hakkında Kanun hükümlerince tüketici, on dört gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir. Bu süre içerisinde yapılan abonelik iptal ve ücret iade taleplerinde, aracın içeride kaldığı günler için ücret, ilgili otoparka ait güncel fiyat tarifesindeki tam gün ücreti üzerinden hesaplanarak mahsup edilecektir. Talepler, iade prosedürüne uygun olarak aboneler@ispark.istanbul adresine yapılmalıdır.",
  },
  {
    id: "ayin-20si",
    anahtar: "ayın 20si yirmisi 30 gün süre geçerlilik",
    kategori: "Abonelik",
    soru: "Ayın 20’sinde aboneliğim onaylandı ve ödememi yaptım, 30 gün boyunca ücretsiz yararlanabilir miyim?",
    cevap:
      "Ayın 20’sinde onaylanan ve ödemesi yapılan abonelik, 10 günlük süre ile geçerli olacaktır. Takip eden ayın 1’inde yeniden ücret tahakkuk edecektir.",
  },
  {
    id: "ayin-15i",
    anahtar: "ayın 15i ay sonu 31 geçerli kalan günler iade",
    kategori: "Abonelik",
    soru: "15’inde onaylanan aboneliğim ayın 31’ine kadar mı geçerli olacaktır? Bu durumda kullanmadığım günler için ücret iadesi talep edebilir miyim?",
    cevap:
      "Abonelik aktivasyonu, plakanın onaylandığı tarihte başlayıp ilgili aynı ayın 31’inde sonlanır. Abonelik bedeli, plakanın onay tarihinden bağımsız olarak ilgili ayın sonuna kadarki süreyi kapsar, bir sonraki aya devretmez ve tam abonman ücreti olarak tahakkuk eder. Abonelik bedeli bir bütün olup, kullanılmayan günler için ücret iadesi yapılmaz.",
  },
  {
    id: "odeme-tarihleri",
    anahtar: "ne zaman öderim ödeme tarihi ayın 1 4 son gün geç ödeme",
    kategori: "Abonelik",
    soru: "Abonelik ücretini hangi tarihlerde ödeyebilirim?",
    cevap:
      "Aboneliğinizin devam etmesi için her ayın 1’i ila 4’ü arasında aylık abonelik ücretini ödemeniz gerekmektedir. Ücretin zamanında yatırılmaması halinde İSPARK herhangi bir ihtar ve/veya ihbara gerek duymaksızın aboneliği tek taraflı sona erdirme hakkına sahiptir. Abonelik iptalinde, aboneliği iptal edilen kişi/kurum takip eden aya kadar yeniden abone yapılmaz. Parklanma, standart güncel tarife üzerinden ücretlendirilir.",
  },
  {
    id: "plaka-degisimi",
    anahtar: "plaka değiştirdim değiştirmek değişti yeni ruhsat aboneliğim abonelik",
    kategori: "Abonelik",
    soru: "Plaka değişimi yapmak istiyorum, ne yapabilirim?",
    cevap:
      "Yeni ruhsatın, aboneliğe esas mevcut ruhsat ile örtüşmesi koşuluyla değişiklik yapılabilecektir. Değişiklik talebi, kapasite uygunluğu da dikkate alınarak değerlendirilecektir. Değişiklik talepleri için araç ruhsatı görselinin, talep özeti ile birlikte aboneler@ispark.istanbul adresine e-mail olarak iletilmesi gerekmektedir. (Değişiklik işlemi ile ilgili geri bildirim süresi 3 iş günüdür.)",
  },
  {
    id: "borc-red",
    anahtar: "borç reddedildi ret abonelik borcu",
    kategori: "Abonelik",
    soru: "Online abonelik başvurusu yaptım, plaka borcumdan dolayı reddedildi, ne yapabilirim?",
    cevap:
      "Plakasında ödenmemiş park borcu olan veya geçmiş dönem parklanma borcu bulunan araçların abonelik başvurusu onaylanmaz. Borç durumunuzu https://online.ispark.istanbul adresinden sorgulayıp ödeyebilirsiniz. Plaka borcunuzu ödedikten sonra aylık abonelik için yeniden online başvuru yapabilirsiniz. Online başvuru adresimiz: https://ispark.istanbul/abone/",
  },
  {
    id: "arac-iceride-red",
    anahtar: "araç içeride otoparkta kaldı reddedildi",
    kategori: "Abonelik",
    soru: "Online abonelik başvurusu yaptım ama aracım otopark içerisinde olduğu için başvurum reddedildi, ne yapabilirim?",
    cevap:
      "Araç, başvurunun yapıldığı aydan önceki bir tarihte giriş yapmış ve ilgili otopark içerisinde halen park halinde ise ilgili aracın otoparktan çıkışının yapılarak plakaya yansımış olan tüm borç bakiyesinin ödenmesi ve aboneler@ispark.istanbul adresine borcun ödendiği bilgisinin iletilmesi gerekir. Ödeme bilgisi kontrol edildikten sonra başvuru, uygun kontenjan dâhilinde değerlendirilerek sonucu ile ilgili aboneye geri bildirim yapılır.",
  },
  {
    id: "sehir-disi-odeme",
    anahtar: "yurt dışı şehir dışı uzaktan online ödeme kart",
    kategori: "Abonelik",
    soru: "Şehir dışındayım, abonelik ücretimi nasıl ödeyebilirim?",
    cevap: "Abonelik ödemelerinizi yurt içi ve yurt dışından, online olarak https://online.ispark.istanbul/ adresinden ödeyebilirsiniz.",
  },
  {
    id: "ayin-23u-sonrasi",
    anahtar: "ayın 23 sonrası dönüş yok cevap gelmedi bekliyorum başladı mı",
    kategori: "Abonelik",
    soru: "Ayın 26’sında online başvuru yaptım, 4 gün geçti hâlâ dönüş olmadı, üyeliğim başladı mı?",
    cevap:
      "Her ayın 23’ü ve sonrasında yapılacak başvurularda abonelik bir sonraki ayın ilk gününde değerlendirmeye alınır. Sonraki ayın ilk günü aboneliğin onaylanması halinde, abonelik bedeli ile birlikte önceki ayda yapılmış olan kullanımlar da hesaplanarak tahsil edilir.",
  },
  {
    id: "arac-satis-iptal",
    anahtar: "sattım satış abonelik sonlandırma bitirme",
    kategori: "Abonelik",
    soru: "Aracımı sattım, aboneliğimi sonlandırmak istiyorum, ne yapmam gerekiyor?",
    cevap: "Aboneliğinizin iptali için aboneler@ispark.istanbul adresine iptal talebinizi iletmeniz gerekmektedir.",
  },
  {
    id: "abonelik-sartlari",
    anahtar: "şartlar sözleşme koşullar detaylı bilgi",
    kategori: "Abonelik",
    soru: "Abonelik şartları ile ilgili daha detaylı bilgiye nereden ulaşabilirim?",
    cevap:
      "Abonelikle ilgili daha detaylı bilgileri, online başvuru esnasında onayınıza sunulan “OTOPARK PLAKA ABONELİĞİ SÖZLEŞMESİ” içerisinde bulabilirsiniz. Ayrıca otoparklarımızdaki afiş ve bilgilendirme panolarının yanı sıra İSPARK resmi web sayfasında yer alan “İSPARK’a Sor” başlığında sunulan bilgileri inceleyebilirsiniz.",
  },
];
