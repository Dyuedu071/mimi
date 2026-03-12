package com.mimi.service;

import com.mimi.domain.Category;
import com.mimi.domain.User;
import com.mimi.domain.Voucher;
import com.mimi.domain.enums.Role;
import com.mimi.repository.CategoryRepository;
import com.mimi.repository.ProductRepository;
import com.mimi.repository.UserRepository;
import com.mimi.repository.VoucherRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DataInitializationService {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final VoucherRepository voucherRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void initializeData() {
        // Create default user if not exists
        if (userRepository.count() == 0) {
            User defaultUser = new User();
            defaultUser.setUsername("admin");
            defaultUser.setFullName("Admin User");
            defaultUser.setEmail("admin@mimi.com");
            defaultUser.setPassword("$2a$10$WtfQ7DJDfsVo7Xeg3cdIr.3pm4XXfdZXut5bQ91KKY/UOzWvZA8sW");
            defaultUser.setRole(Role.ADMIN);
            userRepository.save(defaultUser);
        }

    //     // Create default categories if not exist
        if (categoryRepository.count() == 0) {
            String[] categoryNames = {
                "Đồ chơi", "Quần áo", "Giày dép", "Xe đẩy", 
                "Bình sữa", "Tã bỉm", "Sữa bột", "Nôi cũi",
                "Ghế ăn dặm", "Đồ dùng tắm"
            };

            for (String name : categoryNames) {
                Category category = new Category();
                category.setName(name);
                categoryRepository.save(category);
            }
        }

    //     // Create sample products if not exist
    //     if (productRepository.count() == 0) {
    //         User defaultUser = userRepository.findAll().get(0);
    //         Category toyCategory = categoryRepository.findByName("Đồ chơi").orElse(categoryRepository.findAll().get(0));
    //         Category strollerCategory = categoryRepository.findByName("Xe đẩy").orElse(categoryRepository.findAll().get(0));
    //         Category chairCategory = categoryRepository.findByName("Ghế ăn dặm").orElse(categoryRepository.findAll().get(0));
    //         Category cribCategory = categoryRepository.findByName("Nôi cũi").orElse(categoryRepository.findAll().get(0));

    //         // Featured products
    //         Product product1 = new Product();
    //         product1.setName("Máy tiệt trùng bình sữa UV");
    //         product1.setDescription("Máy tiệt trùng hiện đại với công nghệ UV, an toàn cho bé");
    //         product1.setBuyPrice(new BigDecimal("1500000"));
    //         product1.setRentPrice(new BigDecimal("150000"));
    //         product1.setRentUnit(RentUnit.MONTH);
    //         product1.setTradeType(TradeType.BOTH);
    //         product1.setConditionPercentage(95);
    //         product1.setStatus(ProductStatus.ACTIVE);
    //         product1.setAddressContact("123 Nguyễn Văn Cừ, Q.5, TP.HCM");
    //         product1.setFeatured(true);
    //         product1.setIsNew(true);
    //         product1.setSeller(defaultUser);
    //         product1.setCategory(toyCategory);
    //         // Chỉ lưu tên file (backend GET /api/products/images/{filename} dùng filename)
    //         List<ProductImage> images1 = new ArrayList<>();
    //         images1.add(new ProductImage(null, product1,
    //                 "may-tiet-trung-binh-sua-co-say-kho-bang-tia-uv-spectra-1.jpg",
    //                 true));
    //         product1.setImages(images1);
    //         productRepository.save(product1);

    //         Product product2 = new Product();
    //         product2.setName("Máy hút sữa điện tử thông minh");
    //         product2.setDescription("Máy hút sữa với nhiều chế độ massage tự nhiên");
    //         product2.setBuyPrice(new BigDecimal("2000000"));
    //         product2.setRentPrice(new BigDecimal("200000"));
    //         product2.setRentUnit(RentUnit.MONTH);
    //         product2.setTradeType(TradeType.BOTH);
    //         product2.setConditionPercentage(98);
    //         product2.setStatus(ProductStatus.ACTIVE);
    //         product2.setAddressContact("456 Lê Văn Sỹ, Q.3, TP.HCM");
    //         product2.setFeatured(true);
    //         product2.setIsNew(false);
    //         product2.setSeller(defaultUser);
    //         product2.setCategory(toyCategory);
    //         List<ProductImage> images2 = new ArrayList<>();
    //         images2.add(new ProductImage(null, product2,
    //                 "May-hut-sua-dien-doi-Resonance-3-Fb1160VN-3.jpeg",
    //                 true));
    //         product2.setImages(images2);
    //         productRepository.save(product2);

    //         Product product3 = new Product();
    //         product3.setName("Nôi em bé thông minh");
    //         product3.setDescription("Nôi có chức năng ru tự động và phát nhạc");
    //         product3.setBuyPrice(new BigDecimal("5000000"));
    //         product3.setRentPrice(new BigDecimal("500000"));
    //         product3.setRentUnit(RentUnit.MONTH);
    //         product3.setTradeType(TradeType.BOTH);
    //         product3.setConditionPercentage(92);
    //         product3.setStatus(ProductStatus.ACTIVE);
    //         product3.setAddressContact("789 Võ Văn Tần, Q.3, TP.HCM");
    //         product3.setFeatured(true);
    //         product3.setIsNew(false);
    //         product3.setSeller(defaultUser);
    //         product3.setCategory(cribCategory);
    //         List<ProductImage> images3 = new ArrayList<>();
    //         images3.add(new ProductImage(null, product3,
    //                 "top-5-thuong-hieu-noi-cho-be-duoc-ua-chuong-nhat-hien-nay-2020-1595675197.png",
    //                 true));
    //         product3.setImages(images3);
    //         productRepository.save(product3);

    //         // New products
    //         Product product4 = new Product();
    //         product4.setName("Xe đẩy em bé cao cấp");
    //         product4.setDescription("Xe đẩy nhẹ, gấp gọn, phù hợp cho trẻ từ 0-3 tuổi");
    //         product4.setBuyPrice(new BigDecimal("3000000"));
    //         product4.setRentPrice(new BigDecimal("300000"));
    //         product4.setRentUnit(RentUnit.MONTH);
    //         product4.setTradeType(TradeType.BOTH);
    //         product4.setConditionPercentage(90);
    //         product4.setStatus(ProductStatus.ACTIVE);
    //         product4.setAddressContact("321 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM");
    //         product4.setFeatured(false);
    //         product4.setIsNew(true);
    //         product4.setSeller(defaultUser);
    //         product4.setCategory(strollerCategory);
    //         List<ProductImage> images4 = new ArrayList<>();
    //         images4.add(new ProductImage(null, product4,
    //                 "xe-day-tre-em-joie-versatrax-lagoon.jpg",
    //                 true));
    //         product4.setImages(images4);
    //         productRepository.save(product4);

    //         Product product5 = new Product();
    //         product5.setName("Ghế ăn dặm cho bé");
    //         product5.setDescription("Ghế ăn dặm an toàn, có thể điều chỉnh độ cao");
    //         product5.setBuyPrice(new BigDecimal("800000"));
    //         product5.setRentPrice(new BigDecimal("80000"));
    //         product5.setRentUnit(RentUnit.MONTH);
    //         product5.setTradeType(TradeType.BOTH);
    //         product5.setConditionPercentage(85);
    //         product5.setStatus(ProductStatus.ACTIVE);
    //         product5.setAddressContact("654 Cách Mạng Tháng 8, Q.10, TP.HCM");
    //         product5.setFeatured(false);
    //         product5.setIsNew(true);
    //         product5.setSeller(defaultUser);
    //         product5.setCategory(chairCategory);
    //         List<ProductImage> images5 = new ArrayList<>();
    //         images5.add(new ProductImage(null, product5,
    //                 "ghe-an-dam-umoo-1606186868.jpg",
    //                 true));
    //         product5.setImages(images5);
    //         productRepository.save(product5);

    //         Product product6 = new Product();
    //         product6.setName("Bộ đồ chơi giáo dục");
    //         product6.setDescription("Bộ đồ chơi phát triển trí tuệ cho trẻ 1-3 tuổi");
    //         product6.setBuyPrice(new BigDecimal("600000"));
    //         product6.setRentPrice(new BigDecimal("60000"));
    //         product6.setRentUnit(RentUnit.MONTH);
    //         product6.setTradeType(TradeType.BOTH);
    //         product6.setConditionPercentage(88);
    //         product6.setStatus(ProductStatus.ACTIVE);
    //         product6.setAddressContact("987 Nguyễn Thị Minh Khai, Q.1, TP.HCM");
    //         product6.setFeatured(false);
    //         product6.setIsNew(true);
    //         product6.setSeller(defaultUser);
    //         product6.setCategory(toyCategory);
    //         List<ProductImage> images6 = new ArrayList<>();
    //         images6.add(new ProductImage(null, product6,
    //                 "z6021933351086_28eb8d7e91cc13e47c6e338d1bea00f3.jpg",
    //                 true));
    //         product6.setImages(images6);
    //         productRepository.save(product6);
    //     }

    //     // Sample vouchers
        if (voucherRepository.count() == 0) {
            Voucher v1 = new Voucher();
            v1.setCode("GIAM50K");
            v1.setDiscountValue(new BigDecimal("50000"));
            v1.setMinOrderValue(new BigDecimal("200000"));
            v1.setExpirationDate(LocalDateTime.now().plusMonths(3));
            voucherRepository.save(v1);

            Voucher v2 = new Voucher();
            v2.setCode("FREESHIP");
            v2.setDiscountValue(new BigDecimal("30000"));
            v2.setMinOrderValue(new BigDecimal("300000"));
            v2.setExpirationDate(LocalDateTime.now().plusMonths(1));
            voucherRepository.save(v2);

            Voucher v3 = new Voucher();
            v3.setCode("TET2025");
            v3.setDiscountValue(new BigDecimal("100000"));
            v3.setMinOrderValue(new BigDecimal("500000"));
            v3.setExpirationDate(LocalDateTime.now().plusMonths(6));
            voucherRepository.save(v3);
        }
        
        // Initialize additional users
        initializeAdditionalUsers();
        initializeAdditionalUsers2();
    }
    
    private void initializeAdditionalUsers() {
        String[][] userData = {
            {"nguyenngocquynh27092003", "nguyenngocquynh27092003@gmail.com", "123123", "Nguyễn Ngọc Quỳnh", "0865349170", "2000-01-01", "Hà Nội"},
            {"phanhuyentran3204", "phanhuyentran3204@gmail.com", "123123", "Phan Huyền Trân", "0988710881", "2000-01-01", "Hà Nội"},
            {"hoangquangdldcarchive", "hoangquangdldcarchive@gmail.com", "123123", "Hoàng Hữu Quang", "0989503003", "2000-01-01", "Hà Nội"},
            {"lamquangvinh2311", "lamquangvinh2311@gmail.com", "123123", "Lâm Quang Vinh", "0966590824", "2000-01-01", "Hà Nội"},
            {"tranhuyn24", "tranhuyn24@gmail.com", "123123", "Trần Huyền", "0837869666", "2000-01-01", "Hà Nội"},
            {"nguyenkhoi5804", "nguyenkhoi5804@gmail.com", "123123", "Nguyễn Hữu Khôi Nguyên", "0962895165", "2000-01-01", "Hà Nội"},
            {"nguyenanh2004yb", "nguyenanh2004yb@gmail.com", "123123", "Nguyễn Thị Châu Anh", "0918352403", "2000-01-01", "Hà Nội"},
            {"tunganhthcslb2005", "tunganhthcslb2005@gmail.com", "123123", "Nguyễn Tùng Anh", "0963698005", "2000-01-01", "Hà Nội"},
            {"dinh6661", "dinh6661@gmail.com", "123123", "Đinh Tiến Mạnh", "0829515384", "2000-01-01", "Hà Nội"},
            {"dbrian3103", "dbrian3103@gmail.com", "123123", "Nguyễn Minh Đạt", "0936770627", "2000-01-01", "Hà Nội"},
            {"anhnmhe171286", "anhnmhe171286@fpt.edu.vn", "123123", "Nguyễn Minh Anh", "0582710075", "2000-01-01", "Hà Nội"},
            {"lehoanglong3304", "lehoanglong3304@gmail.com", "123123", "Lê Hoàng Long", "0868778033", "2000-01-01", "Hà Nội"},
            {"qanhthanhcong05", "qanhthanhcong05@gmail.com", "123123", "Trần Quang Anh", "0965892243", "2000-01-01", "Hà Nội"},
            {"minhletruong22", "minhletruong22@gmail.com", "123123", "Lê Trường Minh", "0867931656", "2000-01-01", "Hà Nội"},
            {"anhndhs180835", "anhndhs180835@fpt.edu.vn", "123123", "Nguyễn Đức Anh", "0961276439", "2000-01-01", "Hà Nội"},
            {"vutridung05012005", "vutridung05012005@gmail.com", "123123", "vu tri dung", "0397096500", "2000-01-01", "Hà Nội"},
            {"jeonjungshock19", "jeonjungshock19@gmail.com", "123123", "Bùi Chi Linh", "0947722692", "2000-01-01", "Hà Nội"},
            {"tanamson26092004", "tanamson26092004@gmail.com", "123123", "Tạ Nam Sơn", "0374767604", "2000-01-01", "Hà Nội"},
            {"daizlemaico05", "Daizlemaico05@gmail.com", "123123", "Trần Quang Đạt", "0983270405", "2000-01-01", "Hà Nội"},
            {"daihenshin168", "daihenshin168@gmail.com", "123123", "Nguyễn Hoành Đạt", "0986673953", "2000-01-01", "Hà Nội"},
            {"appp200555", "appp200555@gmail.com", "123123", "Nguyễn Thái Bảo", "0969482816", "2000-01-01", "Hà Nội"},
            {"nle6276", "nle6276@gmail.com", "123123", "Nguyễn Thị Thu Lệ", "0337282462", "2000-01-01", "Hà Nội"},
            {"nhingimik", "nhingimik@gmail.com", "123123", "Nguyễn Giang Đông", "0989398211", "2000-01-01", "Hà Nội"},
            {"tam040204", "Tam040204@gmail.com", "123123", "Đỗ Ánh Tâm", "0862555024", "2000-01-01", "Hà Nội"},
            {"nguy", "nguy", "123123", "Nguyễn Thị Hồng Mỹ", "0865197525", "2000-01-01", "Hà Nội"},
            {"thaovanluong0209", "thaovanluong0209@gmail.com", "123123", "Lương Thảo Vân", "0981566282", "2000-01-01", "Hà Nội"},
            {"anhdq2607", "anhdq2607@gmail.com", "123123", "Đoàn Nguyễn Quang Anh", "0986481313", "2000-01-01", "Hà Nội"},
            {"nguyenthithanhnga2202", "nguyenthithanhnga2202@gmail.com", "123123", "Nguyễn Thị Thanh Nga", "0978275118", "2000-01-01", "Hà Nội"},
            {"ducto35", "ducto35@gmail.com", "123123", "Nguyễn Vũ Đức", "0369455756", "2000-01-01", "Hà Nội"},
            {"luucongdat2004", "luucongdat2004@gmail.com", "123123", "Lưu Công Đạt", "0868213183", "2000-01-01", "Hà Nội"},
            {"huyphuoc204", "huyphuoc204@gmail.com", "123123", "Nguyễn Huy Phước", "0385949616", "2000-01-01", "Hà Nội"},
            {"ranin_fox_87", "ranin.fox.87@gmail.com", "123123", "Bùi Quang Anh", "0916214345", "2000-01-01", "Hà Nội"},
            {"binhleosu2412", "binhleosu2412@gmail.com", "123123", "Lê Tiến Bình", "0974333584", "2000-01-01", "Hà Nội"},
            {"hiepledai02", "hiepledai02@gmail.com", "123123", "Lê Đại Hiệp", "0398704357", "2000-01-01", "Hà Nội"},
            {"vuoanh141", "vuoanh141@gmail.com", "123123", "Vũ Thị Kim Oanh", "0386547913", "2000-01-01", "Hà Nội"},
            {"baoanhhmc", "baoanhhmc@gmail.com", "123123", "Phạm Hà Bảo Anh", "0834140603", "2000-01-01", "Hà Nội"},
            {"phamduchieu1407", "phamduchieu1407@gmail.com", "123123", "Phạm Đức Hiếu", "0943425679", "2000-01-01", "Hà Nội"},
            {"vtttrang12062005", "vtttrang12062005@gmail.com", "123123", "Vũ Thị Thu Trang", "0971381612", "2000-01-01", "Hà Nội"},
            {"thinhnphe181767", "thinhnphe181767@fpt.edu.vn", "123123", "Nguyễn Phú Thịnh", "0357159967", "2000-01-01", "Hà Nội"},
            {"khanhxuan1507", "khanhxuan1507@gmail.com", "123123", "Đỗ Khánh Xuân", "0866103564", "2000-01-01", "Hà Nội"},
            {"tungduongle0610", "tungduongle0610@gmail.com", "123123", "Lê Nguyễn Tùng Dương", "0979051629", "2000-01-01", "Hà Nội"},
            {"dangthanhbinh135", "dangthanhbinh135@gmail.com", "123123", "Đặng Thanh Bình", "0832882005", "2000-01-01", "Hà Nội"},
            {"ntramanh1204", "ntramanh1204@gmail.com", "123123", "Nguyễn Trâm Anh", "0975571434", "2000-01-01", "Hà Nội"},
            {"tu78hy", "tu78hy@gmail.com", "123123", "Nguyễn Anh Tú", "0332107314", "2000-01-01", "Hà Nội"},
            {"mainamdepjai", "mainamdepjai@gmail.com", "123123", "Mai Quốc Vượng", "0964946955", "2000-01-01", "Hà Nội"},
            {"minhquanpham1411", "minhquanpham1411@gmail.com", "123123", "Phạm Minh Quân", "0829877109", "2000-01-01", "Hà Nội"},
            {"giahuy31639801", "giahuy31639801@gmail.com", "123123", "Bùi Gia Huy", "0985643876", "2000-01-01", "Hà Nội"},
            {"ntvy04", "Ntvy04@gmail.com", "123123", "Nguyễn Thảo Vy", "0338263886", "2000-01-01", "Hà Nội"},
            {"hohahnhh", "Hohahnhh@gmail.com", "123123", "Nguyễn Phan Hoàn", "0912057280", "2000-01-01", "Hà Nội"},
            {"minhhieus947", "minhhieus947@gmail.com", "123123", "Nguyễn Minh Hiếu", "0387915518", "2000-01-01", "Hà Nội"},
            {"ngocdiep01258", "ngocdiep01258@gmail.com", "123123", "Nguyễn Thị Ngọc Diệp", "0389198205", "2000-01-01", "Hà Nội"},
            {"ngohuyenngoc89", "ngohuyenngoc89@gmail.com", "123123", "Ngô Huyền Ngọc", "0971304858", "2000-01-01", "Hà Nội"},
            {"sonhs8a", "Sonhs8a@gmail.com", "123123", "Giang Quang Sơn", "0338024663", "2000-01-01", "Hà Nội"},
            {"namkhanhgl1108", "namkhanhgl1108@gmail.com", "123123", "Lại Nam Khánh", "0869622777", "2000-01-01", "Hà Nội"},
            {"linhtd_hdg", "Linhtd.hdg@gmail.com", "123123", "Trần Diệu Linh", "0911885366", "2000-01-01", "Hà Nội"},
            {"linhhy2003", "Linhhy2003@gmail.com", "123123", "Vũ Khánh Linh", "0352123801", "2000-01-01", "Hà Nội"},
            {"baấnguong1122004", "Baấnguong1122004@gmail.com", "123123", "Lê Thị Thanh Hằng", "0367123217", "2000-01-01", "Hà Nội"},
            {"uyen57868", "uyen57868@gmail.com", "123123", "Nguyễn Phương Uyên", "0372710976", "2000-01-01", "Hà Nội"},
            {"khanhly061003", "khanhly061003@gmail.com", "123123", "Đặng Ngọc Khánh Ly", "0399626523", "2000-01-01", "Hà Nội"},
            {"minhthan189", "minhthan189@gmail.com", "123123", "Thân Tuệ Minh", "0387396711", "2000-01-01", "Hà Nội"},
            {"haoca1020", "haoca1020@gmail.com", "123123", "Vũ Minh Hiển", "0367628181", "2000-01-01", "Hà Nội"},
            {"phuonghacao2574", "phuonghacao2574@gmail.com", "123123", "Cao Thị Phương Hà", "0377269016", "2000-01-01", "Hà Nội"},
            {"hoangdvmhe170717", "hoangdvmhe170717@fpt.edu.vn", "123123", "Dương Vũ Minh Hoàng", "0962606188", "2000-01-01", "Hà Nội"},
            {"longhg123ll", "longhg123ll@gmail.com", "123123", "Ngô Hoàng Long", "0949238756", "2000-01-01", "Hà Nội"},
            {"kimanhyb198x", "kimanhyb198x@gmail.con", "123123", "Vũ Ngọc Hải", "0326575494", "2000-01-01", "Hà Nội"},
            {"kieuloc3101", "kieuloc3101@gmail.com", "123123", "Kiều Bảo Lộc", "0367488155", "2000-01-01", "Hà Nội"},
            {"phanthithaovan2911", "Phanthithaovan2911@gmail.com", "123123", "PT Thảo Vân", "086559898", "2000-01-01", "Hà Nội"},
            {"ntuonganh23", "ntuonganh23@gail.com", "123123", "Nguyễn Tường Anh", "0988256796", "2000-01-01", "Hà Nội"},
            {"lequynhanh2806s2", "lequynhanh2806s2@gmail.com", "123123", "Lê Quỳnh Anh", "0355987238", "2000-01-01", "Hà Nội"}
        };
        
        int addedCount = 0;
        int skippedCount = 0;
        
        for (String[] data : userData) {
            String username = data[0];
            String email = data[1];
            String password = data[2];
            String fullName = data[3];
            String phoneNumber = data[4];
            String birthdayStr = data[5];
            String address = data[6];
            
            // Skip if email already exists
            if (userRepository.existsByEmail(email)) {
                skippedCount++;
                continue;
            }
            
            // Skip if username already exists
            if (userRepository.existsByUsername(username)) {
                skippedCount++;
                continue;
            }
            
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setFullName(fullName);
            user.setPhoneNumber(phoneNumber);
            user.setBirthday(LocalDate.parse(birthdayStr));
            user.setAddress(address);
            user.setRole(Role.USER);
            
            userRepository.save(user);
            addedCount++;
        }
        
        System.out.println("User initialization completed: " + addedCount + " added, " + skippedCount + " skipped");
    }
}