#!/usr/bin/env ruby
# Street Hustle — A Dope Wars / Taipan-style trading game
# Travel between cities, buy low, sell high, survive random events.
# Buy wholesale from international suppliers for big discounts.

require 'io/console'

module StreetHustle
  DRUGS = {
    "Weed"    => { min: 300,   max: 900,   unit: "oz" },
    "Shrooms" => { min: 500,   max: 1400,  unit: "oz" },
    "Molly"   => { min: 1200,  max: 3500,  unit: "g" },
    "Coke"    => { min: 15000, max: 40000, unit: "g" },
    "Heroin"  => { min: 5000,  max: 18000, unit: "g" },
    "Meth"    => { min: 800,   max: 3000,  unit: "g" },
    "Acid"    => { min: 400,   max: 1800,  unit: "hit" },
    "Fent"    => { min: 20000, max: 65000, unit: "g" },
    "Nyborg"  => { min: 50000, max: 150000, unit: "vial" },
  }.freeze

  CITIES = [
    { name: "Downtown",    risk: 0.20 },
    { name: "Eastside",    risk: 0.15 },
    { name: "Westbrook",   risk: 0.10 },
    { name: "Northgate",   risk: 0.12 },
    { name: "Southport",   risk: 0.18 },
    { name: "The Suburbs", risk: 0.05 },
    { name: "The Docks",   risk: 0.22 },
    { name: "University",  risk: 0.08 },
  ].freeze

  SUPPLIERS = [
    {
      name: "Colombian Drug Lords",
      tag: "Medellin Connect",
      specialties: ["Coke"],
      also_sells: ["Heroin"],
      discount: 0.40,        # 40% off street price
      min_order: 10,
      risk: 0.15,            # chance deal goes bad
      min_rep: 0,
      flavor: [
        "A man in a linen suit meets you at a warehouse.",
        "Your contact slides you a burner phone. 'Call this number, amigo.'",
        "A private plane lands on a dirt strip outside town.",
      ],
    },
    {
      name: "Mexican Cartel",
      tag: "Sinaloa Pipeline",
      specialties: ["Meth", "Fent", "Heroin"],
      also_sells: ["Weed", "Coke"],
      discount: 0.35,
      min_order: 15,
      risk: 0.20,
      min_rep: 5,
      flavor: [
        "A convoy of black SUVs pulls up. Business time.",
        "You meet at a taco stand. The real menu is underneath.",
        "A tunnel entrance behind a tire shop. Your connect is waiting.",
      ],
    },
    {
      name: "Golden Triangle",
      tag: "Southeast Asia Syndicate",
      specialties: ["Heroin", "Molly"],
      also_sells: ["Shrooms", "Acid"],
      discount: 0.45,
      min_order: 8,
      risk: 0.12,
      min_rep: 3,
      flavor: [
        "A cargo container at the docks. The seal is already broken.",
        "A quiet man hands you a package wrapped in newspaper.",
        "The shipment came in on a fishing boat. Smells like the sea.",
      ],
    },
    {
      name: "US Shadow Government",
      tag: "Black Budget Division",
      specialties: ["Fent", "Meth"],
      also_sells: ["Coke", "Molly", "Acid"],
      discount: 0.50,
      min_order: 5,
      risk: 0.08,
      min_rep: 10,
      flavor: [
        "A man in a dark suit flashes a badge you've never seen before.",
        "The drop is at a decommissioned military base. No cameras.",
        "An unmarked helicopter delivers the goods. No questions asked.",
        "Your contact says: 'This operation doesn't exist. Neither do you.'",
      ],
    },
    {
      name: "Alien Greys",
      tag: "Zeta Reticuli Traders",
      specialties: ["Nyborg"],
      also_sells: [],
      discount: 0.30,
      min_order: 3,
      risk: 0.25,
      min_rep: 15,
      flavor: [
        "A blinding light in a cornfield. They're here.",
        "You wake up on a metal table. There's a package beside you.",
        "The crop circles spell out GPS coordinates. You follow them.",
        "A grey figure materializes in your back seat. 'We have product.'",
        "Static on every channel. Then a voice: 'Bring currency. Arrive alone.'",
      ],
    },
  ].freeze

  MAX_DAYS = 30
  STARTING_CASH = 2000
  MAX_INVENTORY = 100
  LOAN_SHARK_RATE = 0.10

  class Game
    def initialize
      @cash = STARTING_CASH
      @debt = 5000
      @bank = 0
      @day = 1
      @city_index = 0
      @inventory = Hash.new(0)
      @health = 100
      @prices = {}
      @gun = false
      @reputation = 0          # earned through successful deals
      @supplier_unlocked = {}  # track which suppliers player has met
      @supplier_heat = Hash.new(0) # heat with each supplier
      generate_prices
    end

    def run
      print_title
      puts "You've got $#{fmt(@cash)}, a $#{fmt(@debt)} debt to a loan shark,"
      puts "and #{MAX_DAYS} days to make your fortune."
      puts
      puts "Buy from the street or make wholesale deals with international suppliers."
      puts "Build your reputation to unlock the big connects.\n\n"
      puts "Press any key to start..."
      $stdin.getch

      loop do
        break if @day > MAX_DAYS || @health <= 0
        daily_turn
      end

      game_over
    end

    private

    # ── Main Loop ──────────────────────────────────────────────

    def daily_turn
      generate_prices
      apply_interest

      loop do
        display_status
        display_market
        menu_line = "\n  [B]uy  [S]ell  [W]holesale  [T]ravel  [D]eposit  [P]ay debt  [Q]uit"
        puts menu_line
        print "  > "
        choice = $stdin.getch.downcase
        puts choice

        case choice
        when 'b' then buy
        when 's' then sell
        when 'w' then wholesale_menu
        when 't' then travel; break
        when 'd' then bank_menu
        when 'p' then pay_debt
        when 'q' then @day = MAX_DAYS + 1; break
        end
      end
    end

    # ── Display ────────────────────────────────────────────────

    def display_status
      system("clear") || system("cls")
      city = CITIES[@city_index][:name]
      puts "=" * 62
      puts "  DAY #{@day}/#{MAX_DAYS}  |  #{city}  |  HP: #{@health}%  |  Rep: #{@reputation}"
      puts "  Cash: $#{fmt(@cash)}  |  Bank: $#{fmt(@bank)}  |  Debt: $#{fmt(@debt)}"
      inv_line = "  Inventory: #{total_inventory}/#{MAX_INVENTORY}"
      inv_line += "  |  [Armed]" if @gun
      puts inv_line
      puts "=" * 62
    end

    def display_market
      puts "\n  %-4s %-10s %10s %10s" % ["#", "Product", "Price", "You Have"]
      puts "  " + "-" * 38
      drug_list.each_with_index do |name, i|
        price = @prices[name]
        held = @inventory[name]
        puts "  %-4s %-10s %10s %10s" % [i + 1, name, "$#{fmt(price)}", held > 0 ? held.to_s : "-"]
      end
    end

    def drug_list
      DRUGS.keys
    end

    # ── Street Buy / Sell ──────────────────────────────────────

    def buy
      print "  Buy which? (1-#{drug_list.size}): "
      idx = gets_num - 1
      return if idx < 0 || idx >= drug_list.size

      name = drug_list[idx]
      price = @prices[name]
      max_afford = @cash / price
      max_carry = MAX_INVENTORY - total_inventory
      max = [max_afford, max_carry].min

      return puts("  Can't afford any #{name}.") if max_afford == 0
      return puts("  Inventory full!") if max_carry == 0

      print "  Buy how many #{name}? (max #{max}): "
      qty = [gets_num, max].min
      return if qty <= 0

      cost = qty * price
      @cash -= cost
      @inventory[name] += qty
      puts "  Bought #{qty} #{name} for $#{fmt(cost)}."
      pause
    end

    def sell
      held = drug_list.select { |d| @inventory[d] > 0 }
      return puts("  Nothing to sell.") || pause if held.empty?

      print "  Sell which? (1-#{drug_list.size}): "
      idx = gets_num - 1
      return if idx < 0 || idx >= drug_list.size

      name = drug_list[idx]
      return puts("  You don't have any #{name}.") || pause if @inventory[name] == 0

      max = @inventory[name]
      print "  Sell how many #{name}? (max #{max}): "
      qty = [gets_num, max].min
      return if qty <= 0

      revenue = qty * @prices[name]
      @cash += revenue
      @inventory[name] -= qty
      @reputation += 1 if qty >= 5  # rep for moving volume
      puts "  Sold #{qty} #{name} for $#{fmt(revenue)}."
      pause
    end

    # ── Wholesale Suppliers ────────────────────────────────────

    def wholesale_menu
      system("clear") || system("cls")
      puts "=" * 62
      puts "  W H O L E S A L E   C O N N E C T S"
      puts "=" * 62
      puts

      available = []
      SUPPLIERS.each_with_index do |s, i|
        locked = @reputation < s[:min_rep]
        status = locked ? "(Locked — need #{s[:min_rep]} rep)" : ""
        tag = locked ? "???" : s[:tag]
        puts "  #{i + 1}. #{s[:name]}  [#{tag}]  #{status}"
        unless locked
          products = (s[:specialties] + s[:also_sells]).join(", ")
          puts "     Sells: #{products}  |  #{(s[:discount] * 100).to_i}% off  |  Min order: #{s[:min_order]}"
          puts "     Risk: #{'*' * (s[:risk] * 50).to_i.clamp(1, 10)}"
        end
        puts
        available << i unless locked
      end

      if available.empty?
        puts "  No suppliers available yet. Build your reputation by selling on the street."
        pause
        return
      end

      print "  Contact which supplier? (0 to cancel): "
      choice = gets_num
      return if choice == 0
      idx = choice - 1
      return if idx < 0 || idx >= SUPPLIERS.size

      supplier = SUPPLIERS[idx]
      if @reputation < supplier[:min_rep]
        puts "  You don't have the reputation to deal with #{supplier[:name]} yet."
        pause
        return
      end

      supplier_deal(supplier)
    end

    def supplier_deal(supplier)
      puts
      puts "  " + "-" * 50
      puts "  #{supplier[:flavor].sample}"
      puts "  " + "-" * 50
      puts

      all_products = supplier[:specialties] + supplier[:also_sells]
      puts "  Available wholesale:"
      all_products.each_with_index do |drug, i|
        base = (@prices[drug] || avg_price(drug))
        is_specialty = supplier[:specialties].include?(drug)
        discount = is_specialty ? supplier[:discount] : supplier[:discount] * 0.6
        wholesale_price = (base * (1.0 - discount)).to_i
        street = @prices[drug] || avg_price(drug)
        savings = ((1.0 - wholesale_price.to_f / street) * 100).to_i
        puts "    #{i + 1}. %-10s $#{fmt(wholesale_price)}/unit  (#{savings}% below street)" % drug
      end
      puts "    0. Walk away"

      print "\n  Buy which? "
      choice = gets_num
      return if choice == 0
      drug_idx = choice - 1
      return if drug_idx < 0 || drug_idx >= all_products.size

      drug = all_products[drug_idx]
      is_specialty = supplier[:specialties].include?(drug)
      discount = is_specialty ? supplier[:discount] : supplier[:discount] * 0.6
      base = (@prices[drug] || avg_price(drug))
      unit_price = (base * (1.0 - discount)).to_i

      max_afford = @cash / unit_price
      max_carry = MAX_INVENTORY - total_inventory
      max = [max_afford, max_carry].min
      min = supplier[:min_order]

      if max < min
        if max_afford < min
          puts "  You need at least $#{fmt(min * unit_price)} for the minimum order of #{min}."
        else
          puts "  Not enough room in your inventory. Need space for at least #{min}."
        end
        pause
        return
      end

      print "  How many #{drug}? (min #{min}, max #{max}): "
      qty = gets_num
      return if qty <= 0

      if qty < min
        puts "  Minimum order is #{min}. #{supplier[:name]} don't do small time."
        pause
        return
      end

      qty = [qty, max].min
      cost = qty * unit_price

      # Risk check — deal might go bad
      risk = supplier[:risk] + (@supplier_heat[supplier[:name]] * 0.03)
      if rand < risk
        supplier_bust(supplier, cost, qty, drug)
      else
        @cash -= cost
        @inventory[drug] += qty
        @reputation += (qty / 5.0).ceil
        @supplier_heat[supplier[:name]] += 1

        puts "\n  Deal complete. #{qty} #{drug} secured for $#{fmt(cost)}."
        puts "  Reputation +#{(qty / 5.0).ceil}"

        # Alien Grey special flavor
        if supplier[:name] == "Alien Greys"
          grey_lines = [
            "  The grey blinks sideways. 'Pleasure doing business, Earth creature.'",
            "  You feel a strange tingling. Missing time? Doesn't matter — you got the goods.",
            "  'Return when you need more. We are always watching.'",
          ]
          puts grey_lines.sample
        end
        pause
      end
    end

    def supplier_bust(supplier, cost, qty, drug)
      outcomes = []

      case supplier[:name]
      when "Colombian Drug Lords"
        outcomes = [
          { msg: "The Colombians suspect you're a rat. Guns drawn!", cash_loss: 0.3, health_loss: 20, partial: true },
          { msg: "DEA raids the warehouse! Everyone scatters!", cash_loss: 0.2, health_loss: 10, partial: false },
          { msg: "The shipment was seized at customs. Your money's gone.", cash_loss: 0.5, health_loss: 0, partial: false },
        ]
      when "Mexican Cartel"
        outcomes = [
          { msg: "Rival cartel ambush! Bullets flying everywhere!", cash_loss: 0.2, health_loss: 25, partial: true },
          { msg: "The feds are onto this route. Deal's off — and they took a 'fee'.", cash_loss: 0.4, health_loss: 5, partial: false },
          { msg: "Your contact got arrested. The whole network is burned.", cash_loss: 0.15, health_loss: 0, partial: false },
        ]
      when "Golden Triangle"
        outcomes = [
          { msg: "Coast guard intercepts the shipment. Product lost at sea.", cash_loss: 0.3, health_loss: 0, partial: false },
          { msg: "The package was a decoy. You've been ripped off.", cash_loss: 0.5, health_loss: 0, partial: false },
          { msg: "Pirates hit the cargo ship. Partial delivery only.", cash_loss: 0.1, health_loss: 5, partial: true },
        ]
      when "US Shadow Government"
        outcomes = [
          { msg: "The operation's been 'disavowed.' Men in black take your cash.", cash_loss: 0.4, health_loss: 0, partial: false },
          { msg: "A black helicopter circles. Your contact vanishes. Half the product too.", cash_loss: 0.2, health_loss: 0, partial: true },
          { msg: "Turns out this was a sting operation by a rival agency.", cash_loss: 0.3, health_loss: 15, partial: false },
        ]
      when "Alien Greys"
        outcomes = [
          { msg: "Dimensional rift collapses mid-transfer. Half the Nyborg is scattered across spacetime.", cash_loss: 0.3, health_loss: 10, partial: true },
          { msg: "The Greys probe your mind and decide you're 'insufficiently evolved.' Deal's off.", cash_loss: 0.2, health_loss: 15, partial: false },
          { msg: "MIB agents burst in! The Greys teleport away, leaving you holding the bag.", cash_loss: 0.4, health_loss: 20, partial: false },
        ]
      end

      outcome = outcomes.sample
      puts "\n  *** #{outcome[:msg]} ***"

      cash_lost = (@cash * outcome[:cash_loss]).to_i
      @cash -= cash_lost
      @health -= outcome[:health_loss]

      puts "  Lost $#{fmt(cash_lost)}!" if cash_lost > 0
      puts "  Health -#{outcome[:health_loss]}%!" if outcome[:health_loss] > 0

      if outcome[:partial]
        partial_qty = (qty * rand(0.3..0.6)).to_i
        if partial_qty > 0
          @inventory[drug] += partial_qty
          puts "  Salvaged #{partial_qty} #{drug} from the chaos."
        end
      end

      @supplier_heat[supplier[:name]] += 2
      pause
    end

    # ── Travel ─────────────────────────────────────────────────

    def travel
      puts "\n  Travel to:"
      CITIES.each_with_index do |city, i|
        marker = i == @city_index ? " (here)" : ""
        puts "    #{i + 1}. #{city[:name]}#{marker}"
      end
      print "  > "
      idx = gets_num - 1
      return if idx < 0 || idx >= CITIES.size || idx == @city_index

      destination = CITIES[idx]
      puts "\n  Driving to #{destination[:name]}..."
      @city_index = idx
      @day += 1

      random_event(destination)
    end

    # ── Random Events ──────────────────────────────────────────

    def random_event(city)
      roll = rand

      if roll < city[:risk]
        police_encounter
      elsif roll < city[:risk] + 0.06
        price_spike
      elsif roll < city[:risk] + 0.11
        price_crash
      elsif roll < city[:risk] + 0.14
        find_drugs
      elsif !@gun && roll > 0.92
        find_gun
      elsif @reputation > 8 && roll > 0.88
        supplier_approaches
      end
    end

    def police_encounter
      puts "\n  *** POLICE! You've been spotted! ***"
      if @gun && rand < 0.5
        puts "  You flash your piece and speed away!"
        puts "  Lost the cops, but that was close."
        pause
      elsif total_inventory == 0
        puts "  They search your car but find nothing. You're free to go."
        pause
      elsif rand < 0.4
        puts "  You floor it and escape through a side street!"
        pause
      else
        confiscated = {}
        drug_list.each do |d|
          next if @inventory[d] == 0
          lost = rand(1..[@inventory[d], 3].min)
          confiscated[d] = lost
          @inventory[d] -= lost
        end
        fine = rand(500..2000)
        fine = [@cash, fine].min
        @cash -= fine
        @health -= rand(5..15)

        puts "  BUSTED! The cops rough you up."
        confiscated.each { |d, n| puts "    Confiscated #{n} #{d}" }
        puts "    Fined $#{fmt(fine)}"
        puts "    Health: #{@health}%"
        pause
      end
    end

    def price_spike
      drug = drug_list.sample
      multiplier = rand(2..4)
      @prices[drug] *= multiplier
      reasons = [
        "A shipment got seized — #{drug} prices skyrocket!",
        "Major bust across town — #{drug} is scarce!",
        "Supply chain dried up — #{drug} prices surge!",
      ]
      puts "\n  !! #{reasons.sample}"
      pause
    end

    def price_crash
      drug = drug_list.sample
      @prices[drug] = (DRUGS[drug][:min] * rand(0.3..0.7)).to_i
      reasons = [
        "A huge shipment of #{drug} just flooded the market!",
        "Rival dealers are dumping #{drug} at rock bottom prices!",
        "Someone's giving away #{drug} — prices tank!",
      ]
      puts "\n  !! #{reasons.sample}"
      pause
    end

    def find_drugs
      drug = (drug_list - ["Nyborg"]).sample  # can't randomly find alien drugs
      qty = rand(1..5)
      space = MAX_INVENTORY - total_inventory
      qty = [qty, space].min
      return if qty <= 0

      spots = ["under a dumpster", "in an alley", "behind a gas station", "in a stolen car"]
      puts "\n  You find #{qty} #{drug} stashed #{spots.sample}!"
      @inventory[drug] += qty
      pause
    end

    def find_gun
      puts "\n  You find a gun in a parking lot!"
      print "  Pick it up? (y/n): "
      if $stdin.getch.downcase == 'y'
        @gun = true
        puts "\n  You're now armed. Might help with the cops."
      else
        puts "\n  You leave it."
      end
      pause
    end

    def supplier_approaches
      available = SUPPLIERS.select { |s| @reputation >= s[:min_rep] }
      return if available.empty?
      supplier = available.sample

      messages = [
        "A stranger slips you a note: '#{supplier[:tag]} wants to talk.'",
        "Your phone buzzes — unknown number. '#{supplier[:name]} heard about you.'",
        "Word on the street: #{supplier[:tag]} is looking for new distributors.",
      ]
      puts "\n  #{messages.sample}"
      puts "  Your reputation is growing..."
      @reputation += 1
      pause
    end

    # ── Banking & Debt ─────────────────────────────────────────

    def bank_menu
      puts "\n  Bank — stash cash safely (no interest)"
      puts "  [D]eposit  [W]ithdraw"
      print "  > "
      choice = $stdin.getch.downcase
      puts choice

      case choice
      when 'd'
        print "  Deposit how much? (have $#{fmt(@cash)}): "
        amt = [gets_num, @cash].min
        return if amt <= 0
        @cash -= amt
        @bank += amt
        puts "  Deposited $#{fmt(amt)}."
      when 'w'
        print "  Withdraw how much? (have $#{fmt(@bank)}): "
        amt = [gets_num, @bank].min
        return if amt <= 0
        @bank -= amt
        @cash += amt
        puts "  Withdrew $#{fmt(amt)}."
      end
      pause
    end

    def pay_debt
      return puts("  No debt to pay.") || pause if @debt == 0
      print "  Pay how much? ($#{fmt(@debt)} owed, $#{fmt(@cash)} cash): "
      amt = [gets_num, @cash, @debt].min
      return if amt <= 0
      @cash -= amt
      @debt -= amt
      if @debt == 0
        puts "  Debt paid in full! The loan shark is off your back."
      else
        puts "  Paid $#{fmt(amt)}. Remaining: $#{fmt(@debt)}."
      end
      pause
    end

    def apply_interest
      return if @debt == 0
      interest = (@debt * LOAN_SHARK_RATE).to_i
      @debt += interest
    end

    # ── Prices ─────────────────────────────────────────────────

    def generate_prices
      @prices = {}
      drug_list.each do |name|
        range = DRUGS[name]
        @prices[name] = rand(range[:min]..range[:max])
      end
    end

    def avg_price(drug)
      (DRUGS[drug][:min] + DRUGS[drug][:max]) / 2
    end

    # ── Utility ────────────────────────────────────────────────

    def total_inventory
      @inventory.values.sum
    end

    def game_over
      system("clear") || system("cls")
      net_worth = @cash + @bank - @debt
      @inventory.each do |drug, qty|
        net_worth += qty * avg_price(drug)
      end

      puts "=" * 54
      puts "            G A M E   O V E R"
      puts "=" * 54

      if @health <= 0
        puts "\n  You didn't survive the streets."
      else
        puts "\n  #{MAX_DAYS} days are up. Time to settle accounts."
      end

      puts "\n  Cash:       $#{fmt(@cash)}"
      puts "  Bank:       $#{fmt(@bank)}"
      puts "  Debt:       $#{fmt(@debt)}"
      inv_value = @inventory.sum { |d, q| q * avg_price(d) }
      puts "  Inventory:  $#{fmt(inv_value)} (estimated)" if inv_value > 0
      puts "  Reputation: #{@reputation}"
      puts "  " + "-" * 32
      puts "  Net Worth:  $#{fmt(net_worth)}"
      puts

      rank = case net_worth
             when -Float::INFINITY..0      then "Dead Broke — the loan shark sends his regards."
             when 0..10_000                then "Small Timer — barely scraping by."
             when 10_001..50_000           then "Corner Boy — you're making a name."
             when 50_001..200_000          then "Shot Caller — respect on the streets."
             when 200_001..500_000         then "Kingpin — you run this town."
             when 500_001..1_000_000       then "Cartel Boss — international connections."
             when 1_000_001..5_000_000     then "Shadow Broker — governments owe you favors."
             else                               "Cosmic Hustler — even the Greys respect you."
             end

      puts "  Rank: #{rank}"
      puts "\n" + "=" * 54
    end

    def print_title
      system("clear") || system("cls")
      puts <<~TITLE

         ____  _                  _     _   _           _   _
        / ___|| |_ _ __ ___  ___| |_  | | | |_   _ ___| |_| | ___
        \\___ \\| __| '__/ _ \\/ _ \\ __| | |_| | | | / __| __| |/ _ \\
         ___) | |_| | |  __/  __/ |_  |  _  | |_| \\__ \\ |_| |  __/
        |____/ \\__|_|  \\___|\\___|\\__| |_| |_|\\__,_|___/\\__|_|\\___|

        A Dope Wars-style trading game

        Suppliers: Colombian Lords | Mexican Cartel | Golden Triangle
                   US Shadow Government | Alien Greys

      TITLE
    end

    def fmt(n)
      n.to_s.reverse.gsub(/(\d{3})(?=\d)/, '\\1,').reverse
    end

    def gets_num
      $stdin.gets.to_i
    end

    def pause
      print "  Press any key..."
      $stdin.getch
    end
  end
end

StreetHustle::Game.new.run
