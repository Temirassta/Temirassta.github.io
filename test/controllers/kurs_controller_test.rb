require 'test_helper'

class KursControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get kurs_index_url
    assert_response :success
  end

end
